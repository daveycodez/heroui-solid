/**
 * Replaces every code fence with a `<CodeBlock>` element (see
 * code-block.tsx) rendered via the CSS Custom Highlight API instead of
 * Expressive Code. EC wrapped every token in a `<span>` — ~7.4k of them on the
 * heaviest component pages, 90%+ of the page DOM — and overlay opens force
 * synchronous style/layout recalcs that scale with that DOM (200ms+ freezes in
 * Safari). Here each block's code is a SINGLE text node (no per-line/per-token
 * spans at all — ~5 DOM nodes per block); token colors are painted through
 * `CSS.highlights` ranges at absolute offsets into that text node + the page's
 * `::highlight()` rules. The SSR HTML is plain text (SEO), and the DOM the
 * overlay recalc has to walk is negligible — so NO `content-visibility` is
 * needed (which is critical: Safari doesn't repaint highlights when a
 * content-visibility subtree is revealed — see docs-code.css).
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
 * The `::highlight()` rules for the whole page are deduped and emitted ONCE
 * (on the first block), never per-block: they are the dominant recalc cost
 * (each rule is re-evaluated on every synchronous style recalc, e.g. an
 * overlay open), so 24 blocks each re-emitting the same ~10 rules turned a
 * ~17ms dropdown-open into ~150ms in Chrome. Deduped to the page's handful of
 * unique color pairs it drops back to ~40ms. Names stay per-block (the
 * registration reads them), only the CSS is shared.
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
   * Escaped code, injected as the `<code>` element's `innerHTML` so it becomes
   * a SINGLE text node (offsets in `ranges` index into it) and hydration never
   * walks it — a dynamic Solid text insert would add marker comments and split
   * the node.
   */
  codeHtml: string
  /** Line count, for the CSS-free line-number gutter (a sibling text node). */
  lineCount: number
  showLineNumbers: boolean
  lang: string
  title: string
  /** Highlight names by styleId (colors live only in `css`). */
  names: string[]
  /** `[start, end, styleId]` token ranges, ABSOLUTE offsets into the code. */
  ranges: [number, number, number][]
  /**
   * Deduped dual-theme `::highlight()` rules for EVERY block on the page —
   * carried only by the first block, empty on the rest (see the module
   * comment: emitting these per-block is the recalc-cost regression).
   */
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

// name -> its two `::highlight()` rules, shared across every block on the page
// so identical rules are emitted once (see the module comment).
type RuleMap = Map<string, string>

function buildPayload(
  highlighter: Highlighter,
  node: Node,
  rules: RuleMap
): CodeBlockPayload {
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
  const ranges: [number, number, number][] = []
  // Absolute offset of the current line's start in the joined code text node;
  // advances by each line's length + 1 (the "\n" that rejoins them).
  let lineStart = 0
  for (const tokens of themedLines) {
    let col = 0
    for (const token of tokens) {
      const start = lineStart + col
      col += token.content.length
      const end = lineStart + col
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
        if (!rules.has(name)) {
          rules.set(
            name,
            `html[data-theme='light'] ::highlight(${name}){color:${light}${lightBg ? `;background-color:${lightBg}` : ""}}` +
              `html[data-theme='dark'] ::highlight(${name}){color:${dark}${darkBg ? `;background-color:${darkBg}` : ""}}`
          )
        }
      }
      ranges.push([start, end, id])
    }
    lineStart += col + 1
  }

  const { title, showLineNumbers } = parseMeta(node.meta ?? "")
  // css is filled in once, on the first block (see the transformer).
  return {
    codeHtml: escapeHtml(code),
    lineCount: code.split("\n").length,
    showLineNumbers,
    lang,
    title,
    names,
    ranges,
    css: ""
  }
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
    const rules: RuleMap = new Map()
    const payloads = found.map(({ siblings, index }) =>
      buildPayload(highlighter, siblings[index], rules)
    )
    // Every block's `::highlight()` rules, deduped, ride on the first block —
    // one <style> for the page instead of one per block (the recalc-cost fix).
    if (payloads.length > 0) {
      payloads[0].css = [...rules.values()].join("")
    }
    found.forEach(({ siblings, index }, i) => {
      siblings[index] = {
        type: "mdxJsxFlowElement",
        name: "CodeBlock",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "data",
            value: JSON.stringify(payloads[i])
          }
        ],
        children: []
      }
    })
  }
}
