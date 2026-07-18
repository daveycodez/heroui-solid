// Ported components tracked for upstream parity. `slug` is the MDX page stem
// (ours and upstream's agree); `demosDir` is the demos directory name (ours and
// upstream's `apps/docs/src/demos/en/<dir>` agree, but differs from the slug
// for text-area/text-field).
export const UPSTREAM_REPO = "heroui-inc/heroui"
export const UPSTREAM_REF = "v3"
export const UPSTREAM_MDX_ROOT = "apps/docs/content/docs/en/react/components"
export const UPSTREAM_DEMOS_ROOT = "apps/docs/src/demos/en"

// A skip excuses a demo from the strict manifest check in either direction.
// Default (missing-skip): an upstream demo that CANNOT exist in the Solid port
// (React-only APIs or dependencies) — never one merely not ported yet, which
// stays failing until ported. With `local: true` (extra-skip): a Solid-only
// demo upstream doesn't have (e.g. the `as`/custom-element adaptations of
// upstream's render-prop demos). Every skip carries its justification.
export type DemoSkip = { stem: string; reason: string; local?: boolean }

// Same contract for upstream page sections: only for sections documenting
// React-impossible API (render props, virtualization). A skipped demo's own
// section is excused automatically when its title slugifies to the stem —
// SectionSkip is for the ones that don't (e.g. "Adding Ripple Effect").
// Stale entries (section gone upstream, or now present locally) fail.
export type SectionSkip = { heading: string; reason: string }

export type PortedComponent = {
  slug: string
  demosDir: string
  skipDemos?: DemoSkip[]
  skipSections?: SectionSkip[]
}

const RENDER_PROP: DemoSkip = {
  stem: "custom-render-function",
  reason:
    "React render-prop API — the Solid port adapts it as Kobalte's `as` prop (see the custom-element demos where ported)"
}

// The Solid-only counterpart to the render-prop demo above: upstream's
// `custom-render-function` is adapted as a Kobalte `as`/custom-element demo,
// which has no upstream file. Extra-skip so the manifest doesn't flag it.
const AS_ELEMENT: DemoSkip = {
  stem: "custom-element",
  local: true,
  reason:
    "Solid-only adaptation of upstream's render-prop demo — Kobalte's `as` prop replaces React's render function"
}

const RENDER_PROPS_SECTION = (heading: string): SectionSkip => ({
  heading,
  reason:
    "documents the React render-prop values — the Solid port has no render-prop API (Kobalte `as` instead)"
})

export const components: PortedComponent[] = [
  {
    slug: "accordion",
    demosDir: "accordion",
    skipDemos: [RENDER_PROP, AS_ELEMENT]
  },
  { slug: "avatar", demosDir: "avatar" },
  {
    slug: "button",
    demosDir: "button",
    skipDemos: [
      RENDER_PROP,
      AS_ELEMENT,
      {
        stem: "ripple-effect",
        reason:
          "upstream composes a React-only <Ripple /> (m3-ripple); the Solid port ships ripple as a CSS flag instead (--button-ripple / .ripple) — see the button-ripple demo under the same Adding Ripple Effect section"
      },
      {
        stem: "ripple",
        local: true,
        reason:
          "Solid-only replacement for upstream's ripple-effect composition demo — shows the CSS-flag ripple (the .ripple class) the port provides in place of a React <Ripple /> child"
      }
    ],
    skipSections: [RENDER_PROPS_SECTION("ButtonRenderProps")]
  },
  { slug: "button-group", demosDir: "button-group" },
  { slug: "card", demosDir: "card" },
  { slug: "chip", demosDir: "chip" },
  {
    slug: "close-button",
    demosDir: "close-button",
    skipSections: [
      RENDER_PROPS_SECTION("RenderProps"),
      {
        heading: "React Aria Button Props",
        reason:
          "documents react-aria-components Button passthrough props — the Solid port is built on Kobalte's Button instead"
      }
    ]
  },
  { slug: "description", demosDir: "description" },
  {
    slug: "dropdown",
    demosDir: "dropdown",
    skipSections: [RENDER_PROPS_SECTION("RenderProps")]
  },
  { slug: "field-error", demosDir: "field-error" },
  { slug: "form", demosDir: "form", skipDemos: [RENDER_PROP] },
  { slug: "input", demosDir: "input" },
  { slug: "kbd", demosDir: "kbd" },
  { slug: "label", demosDir: "label" },
  { slug: "link", demosDir: "link", skipDemos: [RENDER_PROP, AS_ELEMENT] },
  {
    slug: "search-field",
    demosDir: "search-field",
    skipDemos: [RENDER_PROP],
    skipSections: [RENDER_PROPS_SECTION("SearchFieldRenderProps")]
  },
  {
    slug: "list-box",
    demosDir: "list-box",
    skipDemos: [RENDER_PROP],
    skipSections: [
      RENDER_PROPS_SECTION("RenderProps"),
      {
        heading: "ListLayout",
        reason:
          "our ListLayout is a minimal marker (Kobalte `virtualized` + @tanstack/solid-virtual do the windowing); upstream's ListLayout layout-strategy API surface has no Solid equivalent to document"
      }
    ]
  },
  {
    slug: "select",
    demosDir: "select",
    skipDemos: [
      RENDER_PROP,
      {
        stem: "asynchronous-loading",
        reason:
          "built on React Aria's useAsyncList + react-aria-components Collection/ListBoxLoadMoreItem — no Solid/Kobalte equivalent"
      }
    ],
    skipSections: [RENDER_PROPS_SECTION("RenderProps")]
  },
  { slug: "scroll-shadow", demosDir: "scroll-shadow" },
  { slug: "separator", demosDir: "separator", skipDemos: [RENDER_PROP] },
  { slug: "spinner", demosDir: "spinner" },
  { slug: "surface", demosDir: "surface" },
  {
    slug: "tabs",
    demosDir: "tabs",
    skipDemos: [RENDER_PROP, AS_ELEMENT]
  },
  { slug: "text-area", demosDir: "textarea" },
  {
    slug: "text-field",
    demosDir: "textfield",
    skipDemos: [RENDER_PROP],
    skipSections: [RENDER_PROPS_SECTION("TextFieldRenderProps")]
  },
  {
    slug: "tag-group",
    demosDir: "tag-group",
    skipDemos: [
      RENDER_PROP,
      {
        stem: "with-list-data",
        reason:
          "built on React Aria's useListData (@react-stately/data) — the port ships no dependency-free Solid equivalent"
      }
    ],
    skipSections: [RENDER_PROPS_SECTION("RenderProps")]
  }
]
