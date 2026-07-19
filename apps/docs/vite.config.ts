import { fileURLToPath } from "node:url"
import { createSolidBase, defineTheme } from "@kobalte/solidbase/config"
import defaultTheme from "@kobalte/solidbase/default-theme"
import { solidStart } from "@solidjs/start/config"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import { buildSearchIndex } from "./search-index"
import solidbaseConfig from "./solidbase.config"

const theme = defineTheme({
  componentsPath: new URL("./src/theme/", import.meta.url).href,
  extends: defaultTheme
})

const solidbase = createSolidBase(theme)

// Optional subpath the site is served under (e.g. "/heroui-solid/" on GitHub
// Pages). Threaded through vite (asset URLs, import.meta.env.BASE_URL), the
// Router base in app.tsx, and nitro's baseURL (prerender fetches routes with
// the base and writes files without it, so the output maps 1:1 onto the
// subpath).
const base = process.env.DOCS_BASE_PATH
  ? `/${process.env.DOCS_BASE_PATH.replace(/^\/|\/$/g, "")}/`
  : "/"

// heroui-solid source dir (aliased into the docs graph in dev); edits here
// full-reload the page instead of hot-swapping. See the docs-dev-hmr plugin.
const packageSrc = fileURLToPath(
  new URL("../../packages/heroui-solid/src/", import.meta.url)
)

export default defineConfig(({ command }) => ({
  base,
  css: {
    postcss: {
      plugins: [
        {
          // Demote all @kobalte/solidbase CSS into the `solidbase` cascade
          // layer, slotted between heroui's preflight and component styles
          // (see the @layer statement in src/app.css): heroui components
          // always beat the solidbase theme, solidbase chrome still beats
          // the bare reset. Without this the theme's unlayered rules (e.g.
          // reset.css `button { font: inherit }`) override heroui.
          postcssPlugin: "solidbase-into-layer",
          Once(root, { AtRule }) {
            // Windows reports native backslash paths for inlined sources.
            const file = root.source?.input.file?.replace(/\\/g, "/")
            if (!file) {
              return
            }
            if (!file.includes("@kobalte/solidbase")) {
              return
            }
            const layer = new AtRule({ name: "layer", params: "solidbase" })
            for (const node of [...root.nodes]) {
              if (
                node.type === "atrule" &&
                (node.name === "charset" || node.name === "import")
              ) {
                continue
              }
              layer.append(node)
            }
            root.append(layer)
          }
        }
      ]
    }
  },
  resolve: {
    // Dev: resolve heroui-solid to its TS source so it compiles inside the
    // docs app's own vite graph — instant, no package build or watch process.
    // Exact match only; heroui-solid/styles still resolves via package
    // exports. Production builds use dist, like published consumers.
    alias:
      command === "serve"
        ? [
            {
              find: /^heroui-solid$/,
              replacement: fileURLToPath(
                new URL(
                  "../../packages/heroui-solid/src/index.tsx",
                  import.meta.url
                )
              )
            }
          ]
        : [],
    // One Solid instance across the boundary — bun's isolated linker would
    // otherwise give the app and the package their own copies, breaking
    // reactivity/context.
    dedupe: ["solid-js"]
  },
  plugins: [
    tailwindcss(),
    {
      // Workaround from the official solid-start-v2/with-solidbase template:
      // @kobalte/solidbase's internal imports use ".js" specifiers that need
      // re-resolution under vite 8.
      name: "fix-solidbase",
      enforce: "pre",
      resolveId(id, importer) {
        // Redirect the default theme's globals.js to a local shim: upstream
        // calls onMount at module scope (outside any root), which makes
        // Solid's dev build warn "computations created outside a
        // `createRoot` or `render` will never be disposed" on every full
        // page load. The shim exports the same mobileLayout signal.
        if (
          id.endsWith("globals.js") &&
          importer?.includes("@kobalte/solidbase") &&
          importer.includes("default-theme")
        ) {
          return fileURLToPath(
            new URL("./src/theme/globals.ts", import.meta.url)
          )
        }
        if (importer?.includes("@kobalte/solidbase") && id.endsWith(".js")) {
          return this.resolve(id.replace(/\.js$/, ""), importer, {
            skipSelf: true
          })
        }
      }
    },
    {
      // Upstream base-path gaps, patched at build time (no-ops when base is
      // "/", i.e. everywhere but subpath deploys like GitHub Pages):
      // - solid-start's prod SSR manifest hardcodes "/" when building asset
      //   URLs (prod-ssr-manifest.js: `join("/", …)` and `"/" + asset`),
      //   ignoring vite `base` — every <link>/<script> it renders would 404.
      // - solidbase's usePrevNext (client/sidebar.js) compares
      //   `location.pathname === item.link` against un-based sidebar links,
      //   so no page ever matches and prev/next degrade to the first entry.
      // - solidbase's Article.jsx renders prev/next as plain <a href> from
      //   those un-based links, bypassing the Router base.
      // - solid-start's stripBaseUrl (server/handler.js) slices off BASE_URL
      //   including its trailing slash, leaving "api/search" without the
      //   leading "/" — API route lookup misses and requests fall through to
      //   the page renderer (the search index prerendered as an HTML shell).
      name: "deploy-base-patches",
      enforce: "pre",
      transform(code, id) {
        if (base === "/") {
          return
        }
        const baseNoSlash = base.replace(/\/$/, "")
        // The patches string-match dist internals, so a dependency bump can
        // reshape the matched text while keeping the base-path bug — turning
        // a load-bearing patch (the manifest one builds every asset URL) into
        // a silent no-op with a green deploy. Fail the build instead.
        const assertPatched = (pattern: string | RegExp) => {
          const found =
            typeof pattern === "string"
              ? code.includes(pattern)
              : pattern.test(code)
          if (typeof pattern !== "string") {
            pattern.lastIndex = 0
          }
          if (!found) {
            this.error(
              `deploy-base-patches: ${pattern} matched nothing in ${id} — re-check the patch against the installed version`
            )
          }
        }
        if (id.includes("prod-ssr-manifest")) {
          assertPatched('join("/"')
          assertPatched('"/" + asset')
          return code
            .replaceAll('join("/"', `join("${base}"`)
            .replaceAll('"/" + asset', `"${base}" + asset`)
        }
        if (id.includes("start") && id.includes("server/handler")) {
          assertPatched("path.slice(import.meta.env.BASE_URL.length)")
          return code.replace(
            "path.slice(import.meta.env.BASE_URL.length)",
            `path.slice(${JSON.stringify(baseNoSlash)}.length)`
          )
        }
        if (id.includes("solidbase") && id.includes("client/sidebar")) {
          // Slash-tolerant on both sides: Pages 301s extensionless URLs to
          // the trailing-slash form (nitro writes …/button/index.html), so
          // hard loads land with a pathname exact equality never matches.
          assertPatched("location.pathname === item.link")
          return code.replace(
            "location.pathname === item.link",
            `location.pathname.replace(/\\/+$/, "") === ("${baseNoSlash}" + item.link).replace(/\\/+$/, "")`
          )
        }
        // Mobile drawer logo: Layout.jsx falls back to href="/" when no
        // siteUrl is configured (the header logo goes through withBase; this
        // upstream one doesn't). Scoped to .jsx — Layout.module.css shares
        // the prefix.
        if (
          id.includes("solidbase") &&
          id.includes("default-theme/Layout.jsx")
        ) {
          assertPatched('config().siteUrl || "/"')
          return code.replace(
            'config().siteUrl || "/"',
            `config().siteUrl || "${base}"`
          )
        }
        // Scoped to the .jsx module: Article.module.css shares the prefix
        // and must keep passing through untouched (and unasserted).
        if (id.includes("solidbase") && id.includes("components/Article.jsx")) {
          const prevNextHref =
            /href=\{(customLink\(frontmatter\(\)\?\.(?:prev|next)\) \?\?\s*prevNext\.(?:prev|next)Link\(\)\.link)\}/g
          assertPatched(prevNextHref)
          return code.replace(
            prevNextHref,
            (_, expr) => `href={"${baseNoSlash}" + (${expr})}`
          )
        }
      }
    },
    {
      // Search index for src/routes/api/search.ts: the MDX pipeline owns
      // `.mdx` imports (even with `?raw`), so the index is built from disk
      // at config time instead (search-index.ts). Like the sidebar below,
      // it's computed once — content edits reach search after a restart.
      name: "docs-search-index",
      resolveId(id) {
        if (id === "virtual:docs-search-index") {
          return "\0docs-search-index"
        }
      },
      load(id) {
        if (id === "\0docs-search-index") {
          return `export default ${JSON.stringify(
            buildSearchIndex(
              fileURLToPath(new URL("./src/routes", import.meta.url))
            )
          )}`
        }
      }
    },
    {
      // The filesystem sidebar in solidbase.config.ts is computed once at
      // config evaluation, so a page added or removed under docs/components
      // never appears without a restart. Restart automatically on add/unlink
      // (edits still HMR normally; frontmatter title changes still need a
      // manual restart).
      name: "docs-sidebar-restart",
      apply: "serve",
      configureServer(server) {
        const dir = fileURLToPath(
          new URL("./src/routes/docs/components", import.meta.url)
        )
        const onFile = (file: string) => {
          if (file.startsWith(dir) && file.endsWith(".mdx")) {
            server.restart()
          }
        }
        server.watcher.on("add", onFile)
        server.watcher.on("unlink", onFile)
      }
    },
    {
      name: "docs-dev-hmr",
      apply: "serve",
      enforce: "pre",
      // Editing heroui-solid source (aliased into this graph) must FULL-RELOAD
      // the page, not hot-swap it. solid-refresh can't hot-replace the
      // package's Object.assign compound components across the module boundary
      // — a partial HMR feeds a half-swapped module in and crashes
      // (`Cannot read properties of undefined (reading 'name')`). Returning []
      // suppresses the module update; the manual full-reload is instant here
      // and sidesteps solid-refresh entirely. CSS overrides fall through to
      // normal HMR (no reload).
      handleHotUpdate({ file, server }) {
        if (packageSrc && file.startsWith(packageSrc) && /\.[cm]?tsx?$/.test(file)) {
          server.ws.send({ type: "full-reload" })
          return []
        }
      },
      // HMR for ```tsx file=… code imports. solidbase's remarkImportCodeFile
      // fs.readFileSync's the demo at MDX-compile time and inlines it, but
      // never tells vite the .mdx depends on that demo — so editing a demo
      // leaves the printed snippet stale (a restart doesn't reliably fix it
      // either, since the .mdx output can hash-match). Resolve each file=
      // import while the .mdx transforms and addWatchFile it, so a demo edit
      // invalidates the .mdx, re-runs the remark read, and HMRs the snippet.
      async transform(code, id) {
        if (!id.includes(".mdx")) return
        const fileMeta = /(?:^|\s)file=(?:"([^"]+)"|(\S+))/g
        for (const line of code.split("\n")) {
          if (!line.startsWith("```")) continue
          fileMeta.lastIndex = 0
          let match: RegExpExecArray | null
          while ((match = fileMeta.exec(line))) {
            const filePath = (match[1] ?? match[2] ?? "").split("#")[0]
            if (!filePath) continue
            const resolved = await this.resolve(filePath, id)
            if (resolved) this.addWatchFile(resolved.id)
          }
        }
      }
    },
    solidbase.plugin(solidbaseConfig),
    solidStart(solidbase.startConfig()),
    // Nitro only for build/prerender — never dev. Its v3-beta vite plugin
    // installs a FetchableDevEnvironment (out-of-process dev worker) for the
    // `ssr` environment; solid-start's dev server sees `dispatchFetch` on it
    // and hands SSR to that worker (dev-server.js). The worker compiles the
    // SSR graph lazily on first request and only waits a hardcoded ~3.1s
    // (5-try backoff in dev-worker.mjs) before answering `503 Vite environment
    // "ssr" is unavailable` — the full-screen cold-start/restart error a
    // refresh clears. Omitting nitro in `serve` leaves the plain Vite runnable
    // `ssr` env, so solid-start's own middleware drives SSR via
    // `runner.import("./src/entry-server.tsx")`, which awaits the import fully
    // (slow first load at worst, never a 503). Build still needs nitro for the
    // server bundle + prerender.
    ...(command === "serve"
      ? []
      : [
          nitro({
            // TODO: switch to `preset: "static"` once the nitro vite plugin
            // supports it (as of 3.0.260610-beta it still builds the server env
            // and fails). Until then, deploy .output/public — it's a complete
            // static site.
            baseURL: base,
            prerender: {
              crawlLinks: true,
              // Explicit routes replace the crawler's default "/" start point,
              // so it must be listed alongside the search index (which is
              // fetched, never linked, and thus undiscoverable by crawling).
              routes: ["/", "/api/search"],
              // Nitro defaults this off: a route that 404s/throws is logged,
              // its file omitted, and the build still exits 0 — CI would deploy
              // a partial site.
              failOnError: true
            }
          })
        ])
  ]
}))
