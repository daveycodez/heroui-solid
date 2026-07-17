// Ported components tracked for upstream parity. `slug` is the MDX page stem
// (ours and upstream's agree); `demosDir` is the demos directory name (ours and
// upstream's `apps/docs/src/demos/en/<dir>` agree, but differs from the slug
// for text-area/text-field).
export const UPSTREAM_REPO = "heroui-inc/heroui"
export const UPSTREAM_REF = "v3"
export const UPSTREAM_MDX_ROOT = "apps/docs/content/docs/en/react/components"
export const UPSTREAM_DEMOS_ROOT = "apps/docs/src/demos/en"

// A skip excuses an upstream demo from the strict missing-demo check. Skips
// are for demos that CANNOT exist in the Solid port (React-only APIs or
// dependencies) — never for demos that are merely not ported yet; those stay
// failing until ported. Every skip carries its justification.
export type DemoSkip = { stem: string; reason: string }

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

const RENDER_PROPS_SECTION = (heading: string): SectionSkip => ({
  heading,
  reason:
    "documents the React render-prop values — the Solid port has no render-prop API (Kobalte `as` instead)"
})

export const components: PortedComponent[] = [
  {
    slug: "button",
    demosDir: "button",
    skipDemos: [
      RENDER_PROP,
      {
        stem: "ripple-effect",
        reason: "composition example built on m3-ripple, a React-only package"
      }
    ],
    skipSections: [
      RENDER_PROPS_SECTION("ButtonRenderProps"),
      {
        heading: "Adding Ripple Effect",
        reason:
          "section for the skipped ripple-effect demo (m3-ripple is React-only)"
      }
    ]
  },
  { slug: "card", demosDir: "card" },
  { slug: "description", demosDir: "description" },
  {
    slug: "dropdown",
    demosDir: "dropdown",
    skipSections: [RENDER_PROPS_SECTION("RenderProps")]
  },
  { slug: "field-error", demosDir: "field-error" },
  { slug: "input", demosDir: "input" },
  { slug: "label", demosDir: "label" },
  { slug: "link", demosDir: "link", skipDemos: [RENDER_PROP] },
  {
    slug: "list-box",
    demosDir: "list-box",
    skipDemos: [
      RENDER_PROP,
      {
        stem: "virtualization",
        reason:
          "built on React Aria's Virtualizer/ListLayout — no Solid/Kobalte equivalent (documented in the page's Differences section)"
      }
    ],
    skipSections: [
      RENDER_PROPS_SECTION("RenderProps"),
      {
        heading: "ListLayout",
        reason:
          "API reference for the skipped virtualization demo (React Aria Virtualizer)"
      }
    ]
  },
  {
    slug: "select",
    demosDir: "select",
    skipDemos: [RENDER_PROP],
    skipSections: [RENDER_PROPS_SECTION("RenderProps")]
  },
  { slug: "spinner", demosDir: "spinner" },
  { slug: "surface", demosDir: "surface" },
  { slug: "text-area", demosDir: "textarea" },
  {
    slug: "text-field",
    demosDir: "textfield",
    skipDemos: [RENDER_PROP],
    skipSections: [RENDER_PROPS_SECTION("TextFieldRenderProps")]
  }
]
