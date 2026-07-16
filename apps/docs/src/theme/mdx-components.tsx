import { demos } from "../demos"

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

// Live demo showcase for MDX pages: looks up a demo component from the
// registry and renders it in a bordered box.
export function ComponentPreview(props: { name: string }) {
  const Demo = demos[props.name]
  return (
    <div
      style={{
        display: "flex",
        "flex-wrap": "wrap",
        gap: "0.75rem",
        "align-items": "center",
        "justify-content": "center",
        "min-height": "9rem",
        padding: "2.5rem 1rem",
        border: "1px solid rgba(128, 128, 128, 0.25)",
        "border-radius": "12px"
      }}
    >
      {Demo ? <Demo /> : <code>Unknown demo: {props.name}</code>}
    </div>
  )
}
