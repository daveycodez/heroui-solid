# code-highlight

Syntax highlighting for the docs' code blocks via the **CSS Custom Highlight
API** instead of per-token `<span>`s. Built to be lifted out into a standalone
plugin later — all the plugin-specific code lives in this folder.

## Why

Traditional highlighters (Shiki, Expressive Code, Prism…) wrap every token in a
`<span>` — ~7.4k of them on the heaviest docs pages, 90%+ of the page DOM.
Opening an overlay (dropdown/select/menu) forces a synchronous style/layout
recalc that scales with that DOM, so opens froze 200ms+ in Safari.

Here each block's code is a **single text node**. Colors are painted by
registering `Range`s in the document-global `CSS.highlights` registry and
styling them with `::highlight()` rules — no wrapper spans at all (~5 DOM nodes
per block). SSR ships plain text (good for SEO); colors apply on the client.

## Files

| File | Runs | Responsibility |
|---|---|---|
| `remark-code-highlight.ts` | build (remark) | Tokenizes each fence once with **both** github themes (`codeToTokensWithThemes` → union token boundaries), builds absolute-offset ranges + deduped dual-theme `::highlight()` CSS, and replaces the `code` node with a `<CodeBlock data=… />` element. Exports `remarkCodeHighlight` + `CodeBlockPayload`. |
| `code-block.tsx` | client (Solid) | The `<CodeBlock>` component: renders `<pre><code>` (single text node via `innerHTML`) + optional gutter + copy button, and registers/cleans up the block's ranges in `onMount`. |
| `highlight-init.ts` | client (head) | `HIGHLIGHT_INIT_SCRIPT` — a blocking inline `<head>` script (same trick as the theme flash-prevention script) defining `__shReg`, which each block's trailing inline `<script>` calls at HTML-parse time so colors paint before hydration. |
| `code-block.css` | — | Panel, line-number gutter, copy button. |

## Key design points

- **Dual theme, one range set.** Tokenizing with both themes at once gives
  identical token boundaries, so a single set of ranges serves light and dark;
  switching is a pure CSS swap via `html[data-theme='light'|'dark'] ::highlight(…)`.
- **Highlight names are global** (derived from the color pair), so blocks share
  them (`Highlight` registries are set-like). The `::highlight()` rules are
  **deduped and emitted once per page** (on the first block) — emitting them
  per block re-runs every rule on each style recalc and made overlay opens ~9x
  slower.
- **No `content-visibility`.** Safari does not repaint custom highlights when a
  `content-visibility` subtree is revealed → off-screen blocks scrolled into
  view showed white. The single-text-node markup is light enough not to need it.
- **Paint before hydration.** The parse-time `__shReg` call colors each block as
  its HTML streams in; `onMount` only adopts that registration for cleanup, and
  re-registers itself on client-side navigation (where inline scripts don't run)
  or if hydration replaced the text node.
- **Color only.** `::highlight()` supports color/background, not font-style —
  the github themes barely use italic/bold, so it's dropped.

## Wiring (the only touchpoints outside this folder)

1. **Register the remark plugin** — `solidbase.config.ts`:
   `markdown.remarkPlugins: [remarkComponentPreviewCode, remarkCodeHighlight]`,
   with `expressiveCode: false`.
2. **Register the component** — `theme/mdx-components.tsx` exports `CodeBlock`
   (solidbase's MDX component map) so `<CodeBlock>` resolves.
3. **Inject the head script** — `entry-server.tsx` renders
   `<script innerHTML={HIGHLIGHT_INIT_SCRIPT} />` as an early `<head>` child.
4. **Import the CSS** — `app.css`: `@import "./code-highlight/code-block.css"`.

Depends on: `shiki` (build-time only — never in the client bundle; `code-block.tsx`
imports `CodeBlockPayload` type-only). Consumes fence meta `title=""` and
`showLineNumbers`. Requires the `--docs-code-bg` / `--muted` / `--foreground`
CSS tokens from the consumer.

## Not part of the plugin

`remark-component-preview-code.ts` (docs' ComponentPreview folding + injects
`showLineNumbers`) and the `.component-preview .code-block` / `.mask-to-bottom`
rules in `docs-code.css` are docs-specific integration, intentionally left out.
