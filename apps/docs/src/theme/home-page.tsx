import { buttonVariants } from "heroui-solid"
import { type Component, For } from "solid-js"
import GitHubIcon from "~icons/mdi/github"
import { demos } from "../demos"
import { withBase } from "./base"

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

export function HomePage() {
  return (
    <section
      data-home
      class="flex flex-col items-center pt-8 text-center sm:pt-14"
    >
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
            href={withBase("/docs/getting-started")}
          >
            Get Started
          </a>
          <a
            class={buttonVariants({ variant: "outline" })}
            href={withBase("/docs/components/button")}
          >
            Components
          </a>
        </div>
        <a
          class="text-muted hover:text-foreground mt-6 flex items-center gap-2 text-xs transition-colors"
          href="https://github.com/daveycodez/heroui-solid"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GitHubIcon aria-hidden="true" class="size-4" />
          <span>GitHub</span>
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

      <footer class="text-muted mt-16 pt-8 text-center text-sm">
        <p>
          Design and styles by{" "}
          <a
            class="text-foreground hover:underline"
            href="https://heroui.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            HeroUI
          </a>
          .
        </p>
      </footer>
    </section>
  )
}
