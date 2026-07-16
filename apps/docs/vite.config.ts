import { createSolidBase } from "@kobalte/solidbase/config";
import defaultTheme from "@kobalte/solidbase/default-theme";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const solidbase = createSolidBase(defaultTheme);

export default defineConfig({
  plugins: [
    {
      // Workaround from the official solid-start-v2/with-solidbase template:
      // @kobalte/solidbase's internal imports use ".js" specifiers that need
      // re-resolution under vite 8.
      name: "fix-solidbase",
      enforce: "pre",
      resolveId(id, importer) {
        if (importer?.includes("@kobalte/solidbase") && id.endsWith(".js")) {
          return this.resolve(id.replace(/\.js$/, ""), importer, { skipSelf: true });
        }
      },
    },
    solidbase.plugin({
      title: "HeroUI Solid",
      titleTemplate: ":title - HeroUI Solid",
      description: "Unofficial SolidJS port of HeroUI v3, built on Kobalte and @heroui/styles",
      themeConfig: {
        sidebar: {
          "/": [
            {
              title: "Overview",
              collapsed: false,
              items: [
                { title: "Home", link: "/" },
                { title: "Getting Started", link: "/docs/getting-started" },
              ],
            },
            {
              title: "Components",
              collapsed: false,
              items: [],
            },
          ],
        },
      },
    }),
    solidStart(solidbase.startConfig()),
    nitro({
      prerender: {
        crawlLinks: true,
      },
    }),
  ],
});
