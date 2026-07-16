import path from "node:path"
import { fileURLToPath } from "node:url"
import type { SolidBaseConfig } from "@kobalte/solidbase/config"
import {
  createDefaultThemeFilesystemSidebar,
  type DefaultThemeConfig
} from "@kobalte/solidbase/default-theme"

// Sidebar mirrors the official HeroUI docs (heroui-inc/heroui#v3): a curated
// Overview section, then Components generated from the filesystem — every
// .mdx in src/routes/docs/components lists itself, alphabetically, titled by
// its frontmatter `title` (badge via `status: new | updated`).
const relativeToCwd = (url: string) =>
  path.relative(process.cwd(), fileURLToPath(new URL(url, import.meta.url)))

const config: SolidBaseConfig<DefaultThemeConfig> = {
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
          base: "docs/components",
          items: createDefaultThemeFilesystemSidebar(
            relativeToCwd("./src/routes/docs/components")
          )
        }
      ]
    }
  }
}

export default config
