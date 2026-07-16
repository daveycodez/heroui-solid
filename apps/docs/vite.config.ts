import { fileURLToPath } from "node:url"
import { createSolidBase, defineTheme } from "@kobalte/solidbase/config"
import defaultTheme from "@kobalte/solidbase/default-theme"
import { solidStart } from "@solidjs/start/config"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

const theme = defineTheme({
  componentsPath: new URL("./src/theme/", import.meta.url).href,
  extends: defaultTheme
})

const solidbase = createSolidBase(theme)

export default defineConfig(({ command }) => ({
  resolve: {
    alias:
      command === "serve"
        ? [
            {
              // Dev only: resolve heroui-solid to its TypeScript source so
              // component edits HMR instantly without a package build.
              // Exact match — subpath imports like heroui-solid/styles.css
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
    {
      // Workaround from the official solid-start-v2/with-solidbase template:
      // @kobalte/solidbase's internal imports use ".js" specifiers that need
      // re-resolution under vite 8.
      name: "fix-solidbase",
      enforce: "pre",
      resolveId(id, importer) {
        if (importer?.includes("@kobalte/solidbase") && id.endsWith(".js")) {
          return this.resolve(id.replace(/\.js$/, ""), importer, {
            skipSelf: true
          })
        }
      }
    },
    solidbase.plugin({
      title: "HeroUI Solid",
      titleTemplate: ":title - HeroUI Solid",
      description:
        "Unofficial SolidJS port of HeroUI v3, built on Kobalte and @heroui/styles",
      themeConfig: {
        sidebar: {
          "/": [
            {
              title: "Overview",
              collapsed: false,
              items: [
                { title: "Home", link: "/" },
                { title: "Getting Started", link: "/docs/getting-started" }
              ]
            },
            {
              title: "Components",
              collapsed: false,
              items: [{ title: "Button", link: "/docs/components/button" }]
            }
          ]
        }
      }
    }),
    solidStart(solidbase.startConfig()),
    nitro({
      // TODO: switch to `preset: "static"` once the nitro vite plugin supports
      // it (as of 3.0.260610-beta it still builds the server env and fails).
      // Until then, deploy .output/public — it's a complete static site.
      prerender: {
        crawlLinks: true
      }
    })
  ]
}))
