import { createSignal, onCleanup, onMount } from "solid-js"
import type { HighlightAdditions } from "./highlight-init"
import type { CodeBlockPayload } from "./remark-code-highlight"

// Code block rendered via the CSS Custom Highlight API. The code is a SINGLE
// text node (built at compile time by remark-code-highlight.ts and injected
// with innerHTML — no per-line/per-token spans, ~5 nodes per block); token
// colors are painted through `CSS.highlights` ranges at absolute offsets into
// that text node + the page's `::highlight()` rules. So the SSR HTML is plain
// text (SEO) and there is almost no DOM for an overlay-open recalc to walk —
// no `content-visibility` needed (and it must be avoided: Safari drops
// highlight paint when such a subtree is revealed). Browsers without the API
// (Firefox < 140) get readable uncolored code.
//
// Colors paint at HTML-parse time, not hydration: the trailing inline
// `<script>` calls the `__shReg` registrar defined in <head> (see
// highlight-init.ts — the THEME_INIT_SCRIPT trick) as soon as this
// block's text node exists. onMount then merely adopts that registration for
// cleanup; it registers itself only when the script never ran (client-side
// navigation) or its ranges went stale.
export function CodeBlock(props: { data: string }) {
  // Static build-time prop — parse once, no reactivity involved.
  const data: CodeBlockPayload = JSON.parse(props.data)
  const [copied, setCopied] = createSignal(false)
  let figRef!: HTMLElement & { __sh?: HighlightAdditions }
  let codeRef!: HTMLElement
  let timer: ReturnType<typeof setTimeout> | undefined

  const gutter = data.showLineNumbers
    ? Array.from({ length: data.lineCount }, (_, i) => i + 1).join("\n")
    : ""

  const unregister = (added: HighlightAdditions) => {
    for (const [name, highlight, range] of added) {
      highlight.delete(range)
      if (highlight.size === 0) {
        CSS.highlights.delete(name)
      }
    }
  }

  onMount(() => {
    if (typeof Highlight === "undefined" || !CSS.highlights) {
      return
    }
    let added = figRef.__sh
    // Stale = hydration replaced the innerHTML content after the parse-time
    // script registered — those ranges point at a detached text node.
    if (
      !added ||
      (added.length > 0 && !added[0][2].startContainer.isConnected)
    ) {
      if (added) {
        unregister(added)
      }
      added = []
      const text = codeRef.firstChild
      if (text) {
        for (const [start, end, styleId] of data.ranges) {
          const range = new Range()
          range.setStart(text, start)
          range.setEnd(text, end)
          const name = data.names[styleId]
          let highlight = CSS.highlights.get(name)
          if (!highlight) {
            highlight = new Highlight()
            CSS.highlights.set(name, highlight)
          }
          // Highlight registries are set-like: blocks sharing a name (same
          // color pair) each contribute their own ranges.
          highlight.add(range)
          added.push([name, highlight, range])
        }
      }
    }
    const registered = added
    onCleanup(() => unregister(registered))
  })

  onCleanup(() => clearTimeout(timer))

  const copy = () => {
    // The gutter is a sibling of <code>, so codeRef.textContent is exactly the
    // source (no line numbers).
    navigator.clipboard.writeText(codeRef.textContent ?? "")
    setCopied(true)
    clearTimeout(timer)
    timer = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <figure
      ref={figRef}
      class="code-block"
      data-lang={data.lang}
      data-sh={JSON.stringify({ n: data.names, r: data.ranges })}
    >
      {data.title ? (
        <figcaption class="code-block-title">{data.title}</figcaption>
      ) : null}
      <button
        type="button"
        class="code-copy"
        aria-label={copied() ? "Copied" : "Copy code"}
        data-copied={copied() ? "" : undefined}
        onClick={copy}
      />
      <pre tabindex="0">
        {gutter ? (
          <span class="ln-gutter" aria-hidden="true" innerHTML={gutter} />
        ) : null}
        <code ref={codeRef} innerHTML={data.codeHtml} />
      </pre>
      {/* The whole page's deduped ::highlight() rules ride on the first block
          only (data.css empty on the rest) — one stylesheet per page, since
          each rule is re-evaluated on every style recalc and per-block copies
          made overlay opens ~9x slower. innerHTML, not text children: dynamic
          inserts would put hydration marker comments inside <style> and
          corrupt the CSS. */}
      {data.css ? <style innerHTML={data.css} /> : null}
      {/* Registers this block's ranges at HTML-parse time (the flash window);
          framework-inserted copies on client-side nav are inert and onMount
          registers instead. */}
      <script innerHTML="self.__shReg&&__shReg(document.currentScript)" />
    </figure>
  )
}
