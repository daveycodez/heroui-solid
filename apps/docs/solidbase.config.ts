import path from "node:path"
import { fileURLToPath } from "node:url"
import type { SolidBaseConfig } from "@kobalte/solidbase/config"
import {
  createDefaultThemeFilesystemSidebar,
  type DefaultThemeConfig
} from "@kobalte/solidbase/default-theme"
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
  // apps/docs): github-light/github-dark shiki themes (solidbase's default)
  // rendered on a translucent panel instead of the themes' own backgrounds,
  // 13px system-mono type, no frame chrome. Contrast correction is disabled
  // so token colors stay the exact GitHub-theme values the official site
  // shows. The chrome around the blocks lives in src/docs-theme.css.
  markdown: {
    expressiveCode: {
      minSyntaxHighlightingColorContrast: 0,
      styleOverrides: {
        borderRadius: "0.75rem",
        borderWidth: "0px",
        // Dark value = the official rgba(40,40,40,0.4) composited over the
        // official page background, as a solid color (see --docs-code-bg).
        codeBackground: ({ theme }) =>
          theme.type === "dark" ? "#1c1c1e" : "rgba(0, 0, 0, 0.04)",
        codeFontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        codeFontSize: "0.8125rem",
        codeLineHeight: "1.54",
        codePaddingBlock: "0.875rem",
        codePaddingInline: "1rem",
        uiFontFamily: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
        focusBorder: "transparent",
        // Line-number gutter: official faded color, no divider rule (EC
        // stamps gutterBorderColor as a left border on the code column).
        gutterForeground: "rgba(115, 138, 148, 0.4)",
        gutterHighlightForeground: "rgba(115, 138, 148, 0.7)",
        gutterBorderColor: "transparent",
        scrollbarThumbColor: ({ theme }) =>
          theme.type === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        frames: {
          frameBoxShadowCssValue: "none",
          inlineButtonBorder: "transparent",
          inlineButtonForeground: ({ theme }) =>
            theme.type === "dark" ? "#9f9fa9" : "#71717a",
          terminalBackground: ({ theme }) =>
            theme.type === "dark" ? "#1c1c1e" : "rgba(0, 0, 0, 0.04)"
        },
        textMarkers: {
          markBackground: ({ theme }) =>
            theme.type === "dark" ? "#2d2d2d" : "#d6d8e3",
          markBorderColor: "transparent"
        }
      }
    },
    remarkPlugins: [remarkComponentPreviewCode],
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
          items: [{ title: "Getting Started", link: "/docs/getting-started" }]
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
