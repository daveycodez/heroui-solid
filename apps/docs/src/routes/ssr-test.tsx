import { For } from "solid-js"
import { demos } from "../demos"

// SSR/hydration kitchen sink: renders every registered demo on one page so
// `bun nx run docs:ssr-test` can verify the whole component surface survives
// a real server render + client hydration. Not linked from anywhere, so the
// prerender crawler never emits it into deploy builds.
export default function SsrTest() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>SSR hydration kitchen sink</h1>
      <For each={Object.entries(demos)}>
        {([name, Demo]) => (
          <section data-demo={name} style={{ margin: "2rem 0" }}>
            <h2>{name}</h2>
            <Demo />
          </section>
        )}
      </For>
    </main>
  )
}
