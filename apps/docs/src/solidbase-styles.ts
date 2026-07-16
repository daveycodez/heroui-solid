/**
 * Explicit imports of every @kobalte/solidbase default-theme stylesheet.
 *
 * solid-start's dev-mode style crawler (server/collect-styles.ts) does not
 * traverse through JS modules inside node_modules, so CSS imported deep
 * inside solidbase's components is only injected client-side after
 * hydration — a flash of unstyled content on every full page load during
 * `nx dev docs`. Importing the same files from our own src puts them in the
 * crawled module graph, so the dev server inlines them into the SSR HTML.
 *
 * Vite dedupes by module id, so these imports are harmless in production
 * (the same files are already in the client bundle). Keep this list in sync
 * with `find node_modules/@kobalte/solidbase/dist -name '*.css'` when
 * bumping solidbase.
 */
import "@kobalte/solidbase/default-theme/reset.css";
import "@kobalte/solidbase/default-theme/variables.css";
import "@kobalte/solidbase/default-theme/index.css";
import "@kobalte/solidbase/default-theme/Layout.module.css";
import "@kobalte/solidbase/default-theme/mdx-components.module.css";
import "@kobalte/solidbase/default-theme/components/Article.module.css";
import "@kobalte/solidbase/default-theme/components/Badges.module.css";
import "@kobalte/solidbase/default-theme/components/CopyPageLink.module.css";
import "@kobalte/solidbase/default-theme/components/Features.module.css";
import "@kobalte/solidbase/default-theme/components/Footer.module.css";
import "@kobalte/solidbase/default-theme/components/Header.module.css";
import "@kobalte/solidbase/default-theme/components/Hero.module.css";
import "@kobalte/solidbase/default-theme/components/LastUpdated.module.css";
import "@kobalte/solidbase/default-theme/components/Link.module.css";
import "@kobalte/solidbase/default-theme/components/ProjectSelector.module.css";
import "@kobalte/solidbase/default-theme/components/TableOfContents.module.css";
import "@kobalte/solidbase/default-theme/components/ThemeSelector.module.css";
import "@kobalte/solidbase/default-theme/components/VersionSelector.module.css";
