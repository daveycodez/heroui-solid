import type { SolidBaseConfig } from "@kobalte/solidbase/config"
import type { DefaultThemeConfig } from "@kobalte/solidbase/default-theme"

// Sidebar mirrors the official HeroUI docs (heroui-inc/heroui#v3, meta.json
// files under apps/docs/content/docs/en/react): curated sections, components
// listed alphabetically. Add new component pages to `components` in order.
const components = [
  { title: "Button", link: "/docs/components/button" },
  { title: "Spinner", link: "/docs/components/spinner" }
]

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
          items: components
        }
      ]
    }
  }
}

export default config
