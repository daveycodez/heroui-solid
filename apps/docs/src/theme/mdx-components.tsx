// The .jsx extension is required: solidbase's `./default-theme/*` export maps
// verbatim (no extension probing in tsc), so the extensionless specifier fails
// module resolution even though vite resolves it.
import { a as DefaultA } from "@kobalte/solidbase/default-theme/mdx-components.jsx"
import { Button } from "heroui-solid"
import {
  type ComponentProps,
  createSignal,
  type JSX,
  children as resolveChildren,
  Show
} from "solid-js"
import { CodeBlock } from "../code-highlight/code-block"
import { demos } from "../demos"
import { withBase } from "./base"
import { HomePage } from "./home-page"

// Components exported here are registered globally for all MDX pages via
// solidbase's theme `mdx-components` convention.
//
// MDX authoring rules for this app (SSR/hydration breaks under
// @solidjs/start 2.0.0-beta.0 + vite 8 otherwise):
// - Do NOT `import` components inside .mdx files.
// - Do NOT write JSX children of components in MDX. Multiline children get
//   paragraph-wrapped by MDX (`<Button>\nText\n</Button>` compiles to
//   `<Button><p>Text</p></Button>`), which fatally breaks hydration; render
//   props send children resolution into a loop. Demos live in src/demos/
//   as regular TSX instead, referenced by <ComponentPreview name="..." /> —
//   same structure as the official HeroUI docs.

export { CodeBlock, HomePage }

// The default theme renders MDX links as plain <a>, so root-absolute hrefs
// in page content bypass the Router base — prefix them for subpath deploys.
export function a(props: ComponentProps<"a"> & { "data-auto-heading"?: "" }) {
  return (
    <DefaultA
      {...props}
      href={props.href?.startsWith("/") ? withBase(props.href) : props.href}
    />
  )
}

// Live demo showcase, visually identical to the official HeroUI docs
// ComponentPreviewContainer: one card, demo centered in the top section,
// its source attached below, collapsed to 150px behind a fade-out mask
// with a floating "Expand code" button. The code block child is folded in
// by remark-component-preview-code.ts (never authored in MDX — see above);
// `resolveChildren` keeps the single-read children rule.
export function ComponentPreview(props: {
  name: string
  children?: JSX.Element
}) {
  const Demo = demos[props.name]
  const code = resolveChildren(() => props.children)
  const [expanded, setExpanded] = createSignal(false)
  return (
    <div
      class="component-preview group relative my-4 w-full"
      data-name={props.name}
    >
      <div class="not-prose border-separator relative flex min-h-[350px] w-full items-center justify-center overflow-hidden rounded-t-xl border-t border-r border-l p-4 sm:p-10">
        <div class="flex w-full flex-wrap items-center justify-center gap-3">
          {Demo ? <Demo /> : <code>Unknown demo: {props.name}</code>}
        </div>
      </div>
      <Show
        when={code()}
        fallback={<div class="border-separator rounded-b-xl border-b" />}
      >
        <div class="border-separator relative overflow-hidden rounded-b-xl border bg-transparent">
          <div class="relative">
            <div
              classList={{
                "code-block-wrapper": true,
                "mask-to-bottom relative max-h-[150px] overflow-hidden":
                  !expanded(),
                "pb-10": expanded()
              }}
            >
              {code()}
            </div>
            <Button
              class="bg-surface absolute right-1/2 bottom-2 translate-x-1/2 text-xs shadow-sm shadow-black/5"
              size="sm"
              type="button"
              variant="tertiary"
              onClick={() => setExpanded(!expanded())}
            >
              {expanded() ? "Collapse code" : "Expand code"}
            </Button>
          </div>
        </div>
      </Show>
    </div>
  )
}
