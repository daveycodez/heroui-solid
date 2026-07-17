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
            // Solidbase stamps data-theme="sdark"/"slight" in system mode
            // (the s-prefix means "follow the OS"), so heroui's exact
            // [data-theme=dark|light] selectors must substring-match here,
            // like solidbase's own [data-theme*="dark"] CSS does. Scoped per
            // rule via its original source file: heroui-solid/styles reaches
            // postcss inlined into app.css, and solidbase's own CSS must
            // keep its exact matches (its ThemeSelector distinguishes
            // "dark" from "sdark" to pick the trigger icon).
            root.walkRules((rule) => {
              if (
                rule.source?.input.file
                  ?.replace(/\\/g, "/")
                  .includes("heroui-solid/dist") &&
                rule.selector.includes("[data-theme=")
              ) {
                rule.selector = rule.selector.replace(
                  /\[data-theme="?(dark|light)"?\]/g,
                  '[data-theme*="$1"]'
                )
              }
            })
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
    alias:
      command === "serve"
        ? [
            {
              // Dev only: resolve heroui-solid to its TypeScript source so
              // component edits HMR instantly without a package build.
              // Exact match — subpath imports like heroui-solid/styles
              // still resolve through dist (CSS needs the tailwind build).
              // Production builds use dist, same as published consumers.
              find: /^heroui-solid$/,
              replacement: fileURLToPath(
                new URL(
                  "../../packages/heroui-solid/src/index.tsx",
                  import.meta.url
                )
              )
            }
          ]
        : []
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
        if (id.includes("prod-ssr-manifest")) {
          return code
            .replaceAll('join("/"', `join("${base}"`)
            .replaceAll('"/" + asset', `"${base}" + asset`)
        }
        if (id.includes("start") && id.includes("server/handler")) {
          return code.replace(
            "path.slice(import.meta.env.BASE_URL.length)",
            `path.slice(${JSON.stringify(baseNoSlash)}.length)`
          )
        }
        if (id.includes("solidbase") && id.includes("client/sidebar")) {
          return code.replace(
            "location.pathname === item.link",
            `location.pathname === "${baseNoSlash}" + item.link`
          )
        }
        if (id.includes("solidbase") && id.includes("components/Article")) {
          return code.replace(
            /href=\{(customLink\(frontmatter\(\)\?\.(?:prev|next)\) \?\?\s*prevNext\.(?:prev|next)Link\(\)\.link)\}/g,
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
    solidbase.plugin(solidbaseConfig),
    solidStart(solidbase.startConfig()),
    nitro({
      // TODO: switch to `preset: "static"` once the nitro vite plugin supports
      // it (as of 3.0.260610-beta it still builds the server env and fails).
      // Until then, deploy .output/public — it's a complete static site.
      baseURL: base,
      prerender: {
        crawlLinks: true,
        // Explicit routes replace the crawler's default "/" start point, so
        // it must be listed alongside the search index (which is fetched,
        // never linked, and thus undiscoverable by crawling).
        routes: ["/", "/api/search"]
      }
    })
  ]
}))
