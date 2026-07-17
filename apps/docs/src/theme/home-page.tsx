import { buttonVariants } from "heroui-solid"
import { type Component, For } from "solid-js"
import { demos } from "../demos"

// Landing page, modeled on the official heroui.com hero: badge, bold
// two-tone headline, muted tagline, primary/outline actions, GitHub link,
// and a live component showcase below (the official site's DemoShowcase,
// scaled down to the components ported so far). Rendered from index.mdx as
// a single self-closing element — see the MDX authoring rules in
// mdx-components.tsx.

// Six tiles — a uniform 3×2 grid on large screens.
const tiles: Array<{ title: string; demo: Component }> = [
  { title: "Card", demo: demos["card-default"] },
  { title: "Button", demo: demos["button-variants"] },
  { title: "Select", demo: demos["select-default"] },
  { title: "Text Field", demo: demos["textfield-basic"] },
  { title: "Dropdown", demo: demos["dropdown-default"] },
  { title: "Spinner", demo: demos["spinner-colors"] }
]

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      class="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        clip-rule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
        fill-rule="evenodd"
      />
    </svg>
  )
}

export function HomePage() {
  return (
    <section class="flex flex-col items-center pt-8 text-center sm:pt-14">
      <div class="mx-auto flex max-w-2xl flex-col items-center justify-center">
        <span class="border-separator text-muted rounded-full border px-3 py-1 text-xs">
          Unofficial SolidJS port of HeroUI v3
        </span>
        <h1 class="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Beautiful by default.
          <span class="text-muted/70 block">Now for SolidJS.</span>
        </h1>
        <p class="text-muted mt-4 text-balance md:text-lg">
          The HeroUI design system, rebuilt on Kobalte primitives and the same
          @heroui/styles the official React components use.
        </p>
        <div class="mt-6 flex gap-3">
          <a
            class={buttonVariants({ variant: "primary" })}
            href="/docs/getting-started"
          >
            Get Started
          </a>
          <a
            class={buttonVariants({ variant: "outline" })}
            href="/docs/components/button"
          >
            Components
          </a>
        </div>
        <a
          class="text-muted hover:text-foreground mt-6 flex items-center gap-2 text-xs transition-colors"
          href="https://github.com/daveycodez/heroui-solid"
          rel="noreferrer"
          target="_blank"
        >
          <GitHubIcon />
          <span>Star the project on GitHub</span>
        </a>
      </div>

      {/* Oversized flex item: the section's items-center centers it over
          the article column, giving the official full-bleed showcase. */}
      <div class="mt-12 w-[min(100dvw-2.5rem,72rem)]">
        <div class="border-separator bg-background grid grid-cols-1 gap-4 rounded-2xl border p-4 text-left md:grid-cols-2 lg:grid-cols-3">
          <For each={tiles}>
            {(tile) => (
              <div class="border-separator flex min-h-44 flex-col gap-4 rounded-xl border p-6">
                <span class="text-muted text-xs font-medium tracking-wide uppercase">
                  {tile.title}
                </span>
                <div class="home-tile-demo flex flex-1 flex-wrap items-center justify-center gap-3">
                  <tile.demo />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  )
}
