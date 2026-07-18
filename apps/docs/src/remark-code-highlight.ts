/**
 * Replaces every code fence with a `<CodeBlock>` element (see
 * theme/code-block.tsx) rendered via the CSS Custom Highlight API instead of
 * Expressive Code. EC wrapped every token in a `<span>` — ~7.4k of them on the
 * heaviest component pages, 90%+ of the page DOM — and overlay opens force
 * synchronous style/layout recalcs that scale with that DOM (200ms+ freezes in
 * Safari). Here the SSR HTML is plain text (~2 spans per line); token colors
 * are painted client-side through `CSS.highlights` ranges + per-block
 * `::highlight()` rules, so the DOM weight is gone entirely.
 *
 * Tokenizes once with both github themes (`codeToTokensWithThemes` splits on
 * the union of both themes' token boundaries), so a single range set serves
 * both modes and theme switching is a pure CSS swap keyed off
 * `html[data-theme]`. Highlight names derive from the color pair, so they are
 * globally stable across blocks (`Highlight` registries are set-like — blocks
 * sharing a name just contribute ranges to it). `::highlight()` supports only
 * color/background — font styles are dropped (the github themes barely use
 * them).
 *
 * Runs after solidbase's import-code-file (`file=` fences already hold the
 * demo source, meta gains a leading `title="<file>"` — the fence's own
 * `title=""` wins by last-occurrence) and after remarkComponentPreviewCode
 * (which folds demo fences into `<ComponentPreview>` and appends
 * `showLineNumbers`).
 *
 * Dependency-free walk: unist-util-visit isn't hoisted where this config
 * runs under bun's isolated linker.
 */

import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
  type SpecialLanguage
} from "shiki"

export interface CodeBlockPayload {
  /**
   * Pre-escaped `<code>` content, one `.line > .line-content` span per line
   * (plus an empty `.line-number` span when the fence has line numbers —
   * rendered via CSS counters). Injected with `innerHTML` so hydration never
   * walks the block and `.line-content`'s firstChild is always a plain text
   * node (a dynamic Solid insert would add hydration marker comments).
   */
  html: string
  lang: string
  title: string
  /** Highlight names by styleId (colors live only in `css`). */
  names: string[]
  /** Per line: `[start, end, styleId]` token spans, line-relative offsets. */
  lines: [number, number, number][][]
  /** Dual-theme `::highlight()` rules for this block's names. */
  css: string
}

interface Node {
  type: string
  name?: string
  lang?: string
  meta?: string
  value?: string
  children?: Node[]
  attributes?: { type: string; name: string; value: string }[]
}

const LANGS: BundledLanguage[] = ["tsx", "css", "bash", "html"]
const THEMES = { light: "github-light", dark: "github-dark" } as const

let highlighterPromise: Promise<Highlighter> | undefined
const getHighlighter = () =>
  (highlighterPromise ??= createHighlighter({
    themes: Object.values(THEMES),
    langs: LANGS
  }))

function parseMeta(meta: string) {
  let title = ""
  let showLineNumbers = false
  for (const match of meta.matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) {
    // Last occurrence wins, matching EC: import-code-file prepends
    // title="<file>" and the fence's own title="" overrides it.
    if (match[1] === "title" && match[2] !== undefined) title = match[2]
    if (match[1] === "showLineNumbers") showLineNumbers = true
  }
  return { title, showLineNumbers }
}

const ident = (color: string) => color.replace(/[^a-zA-Z0-9]/g, "")

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

function buildPayload(highlighter: Highlighter, node: Node): CodeBlockPayload {
  const code = (node.value ?? "").replace(/\r\n/g, "\n")
  const lang: BundledLanguage | SpecialLanguage = LANGS.includes(
    node.lang as BundledLanguage
  )
    ? (node.lang as BundledLanguage)
    : "text"
  const themedLines = highlighter.codeToTokensWithThemes(code, {
    lang,
    themes: THEMES
  })
  const lightFg = highlighter.getTheme(THEMES.light).fg.toLowerCase()
  const darkFg = highlighter.getTheme(THEMES.dark).fg.toLowerCase()

  const names: string[] = []
  const styleIds = new Map<string, number>()
  let css = ""
  const lines = themedLines.map((tokens) => {
    const spans: [number, number, number][] = []
    let col = 0
    for (const token of tokens) {
      const start = col
      col += token.content.length
      const light = token.variants.light?.color?.toLowerCase() ?? lightFg
      const dark = token.variants.dark?.color?.toLowerCase() ?? darkFg
      const lightBg = token.variants.light?.bgColor?.toLowerCase()
      const darkBg = token.variants.dark?.bgColor?.toLowerCase()
      // Base-foreground and whitespace tokens paint with the block's own
      // color — no range needed.
      if (
        (light === lightFg && dark === darkFg && !lightBg && !darkBg) ||
        token.content.trim() === ""
      ) {
        continue
      }
      const key = `${light}|${dark}|${lightBg ?? ""}|${darkBg ?? ""}`
      let id = styleIds.get(key)
      if (id === undefined) {
        id = names.length
        styleIds.set(key, id)
        const name = `sh-${ident(light)}-${ident(dark)}${
          lightBg || darkBg
            ? `-${ident(lightBg ?? "none")}-${ident(darkBg ?? "none")}`
            : ""
        }`
        names.push(name)
        css += `html[data-theme='light'] ::highlight(${name}){color:${light}${lightBg ? `;background-color:${lightBg}` : ""}}`
        css += `html[data-theme='dark'] ::highlight(${name}){color:${dark}${darkBg ? `;background-color:${darkBg}` : ""}}`
      }
      spans.push([start, col, id])
    }
    return spans
  })

  const { title, showLineNumbers } = parseMeta(node.meta ?? "")
  const gutter = showLineNumbers ? '<span class="line-number"></span>' : ""
  const html = code
    .split("\n")
    .map(
      (text) =>
        `<span class="line">${gutter}<span class="line-content">${escapeHtml(text)}</span></span>`
    )
    .join("\n")
  return { html, lang, title, names, lines, css }
}

function collect(node: Node, found: { siblings: Node[]; index: number }[]) {
  const children = node.children
  if (!children) {
    return
  }
  for (let i = 0; i < children.length; i++) {
    if (children[i].type === "code") {
      found.push({ siblings: children, index: i })
    }
    collect(children[i], found)
  }
}

export function remarkCodeHighlight() {
  return async (tree: Node) => {
    const found: { siblings: Node[]; index: number }[] = []
    collect(tree, found)
    if (found.length === 0) {
      return
    }
    const highlighter = await getHighlighter()
    for (const { siblings, index } of found) {
      const payload = buildPayload(highlighter, siblings[index])
      siblings[index] = {
        type: "mdxJsxFlowElement",
        name: "CodeBlock",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "data",
            value: JSON.stringify(payload)
          }
        ],
        children: []
      }
    }
  }
}
