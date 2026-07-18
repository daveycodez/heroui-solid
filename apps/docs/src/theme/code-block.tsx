import { createSignal, onCleanup, onMount } from "solid-js"
import type { CodeBlockPayload } from "../remark-code-highlight"
import type { HighlightAdditions } from "./highlight-init"

// Code block rendered via the CSS Custom Highlight API — the SSR HTML is
// plain text (~2 spans per line, built at compile time by
// remark-code-highlight.ts) and token colors are painted through
// `CSS.highlights` ranges + the block's `::highlight()` rules, so no token
// span DOM ever exists. `innerHTML` keeps hydration out of the block entirely
// (see CodeBlockPayload.html). Browsers without the API (Firefox < 140) get
// readable uncolored code.
//
// Colors paint at HTML-parse time, not hydration: the trailing inline
// `<script>` calls the `__shReg` registrar defined in <head> (see
// theme/highlight-init.ts — the THEME_INIT_SCRIPT trick) as soon as this
// block's text nodes exist. onMount then merely adopts that registration for
// cleanup; it registers itself only when the script never ran (client-side
// navigation) or its ranges went stale.
export function CodeBlock(props: { data: string }) {
  // Static build-time prop — parse once, no reactivity involved.
  const data: CodeBlockPayload = JSON.parse(props.data)
  const [copied, setCopied] = createSignal(false)
  let figRef!: HTMLElement & { __sh?: HighlightAdditions }
  let codeRef!: HTMLElement
  let timer: ReturnType<typeof setTimeout> | undefined

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
    // script registered — those ranges point at detached nodes.
    if (
      !added ||
      (added.length > 0 && !added[0][2].startContainer.isConnected)
    ) {
      if (added) {
        unregister(added)
      }
      added = []
      const nodes = codeRef.querySelectorAll(".line-content")
      for (let i = 0; i < data.lines.length; i++) {
        const text = nodes[i]?.firstChild
        if (!text) {
          continue
        }
        for (const [start, end, styleId] of data.lines[i]) {
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
    // Gutter numbers are ::before pseudo-content, so textContent is exactly
    // the source: line text joined by the newline separators.
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
      data-sh={JSON.stringify({ n: data.names, l: data.lines })}
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
        <code ref={codeRef} innerHTML={data.html} />
      </pre>
      {/* innerHTML, not text children: dynamic inserts would put hydration
          marker comments inside <style>/<script> and corrupt them. The script
          executes only during the initial HTML parse — exactly the flash
          window; framework-inserted copies (client-side nav) are inert and
          onMount registers instead. */}
      <style innerHTML={data.css} />
      <script innerHTML="self.__shReg&&__shReg(document.currentScript)" />
    </figure>
  )
}
