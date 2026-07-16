import type { JSX } from "solid-js"

// Shared container for /demos/* iframe pages: centers content and
// fills the iframe viewport.
export default function DemoBox(props: { children: JSX.Element }) {
  return (
    <div
      style={{
        display: "flex",
        "flex-wrap": "wrap",
        gap: "0.75rem",
        "align-items": "center",
        "justify-content": "center",
        "min-height": "100vh",
        padding: "1rem"
      }}
    >
      {props.children}
    </div>
  )
}
