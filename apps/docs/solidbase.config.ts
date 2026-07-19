import path from "node:path"
import { fileURLToPath } from "node:url"
import type { SolidBaseConfig } from "@kobalte/solidbase/config"
import {
  createDefaultThemeFilesystemSidebar,
  type DefaultThemeConfig
} from "@kobalte/solidbase/default-theme"
import { remarkCodeHighlight } from "./src/code-highlight/remark-code-highlight"
import { remarkComponentPreviewCode } from "./src/remark-component-preview-code"

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
  // Code blocks mirror the official HeroUI docs (heroui-inc/heroui#v3
  // apps/docs): github-light/github-dark shiki token colors on a translucent
  // panel, 13px system-mono type, no frame chrome. Expressive Code is
  // disabled — its per-token spans (~7.4k on heavy pages) made every overlay
  // open pay a page-sized style/layout recalc (200ms+ freezes in Safari).
  // remarkCodeHighlight renders blocks as plain text via the CSS Custom
  // Highlight API instead — the whole plugin lives in src/code-highlight/
  // (see its README); ComponentPreview integration is in src/docs-code.css.
  markdown: {
    expressiveCode: false,
    remarkPlugins: [remarkComponentPreviewCode, remarkCodeHighlight],
    // Like the official docs, the TOC starts at h2 — no page-title entry.
    toc: { minDepth: 2 }
  },
  themeConfig: {
    // The Docs nav link lives in the logo cluster (theme/header-docs-link.tsx
    // via the VersionSelector slot), not in themeConfig.nav — nav items
    // render on the right side of the header.
    sidebar: {
      "/": [
        {
          title: "Overview",
          collapsed: false,
          items: [
            { title: "Getting Started", link: "/docs/getting-started" },
            { title: "Polymorphism", link: "/docs/polymorphism" }
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
