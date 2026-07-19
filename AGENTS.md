<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `bunx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `bunx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Package Manager

This workspace uses **bun**.

## Docs

When using third party libraries, use Context7 MCP to look up the docs.

## Quality Gates

Before completing any task, ensure all of the following pass:

1. **Biome** — No formatting errors in modified files
2. **Linter** — No lint errors in the project

## GitHub Copilot Instructions

When generating commit messages, always use the Conventional Commits format:
- Start with a type: feat, fix, docs, style, refactor, test, chore, perf, ci, build
- Optionally include a scope in parentheses
- Follow with a colon and space, then a lowercase description
- Example: feat(auth): add password reset flow
- Example: fix: resolve null pointer in user hook

## Component Porting Conventions (packages/heroui-solid)

**Kobalte-first thin skin.** Ported components are a thin UI skin over Kobalte:
pass the Kobalte primitive — and its prop API — straight through, layer
`@heroui/styles` theming on top, and add *only* the extras that are specific to
HeroUI and have no Kobalte equivalent. Behavior, state, accessibility, focus
management, collections, and performance are Kobalte's job — we do not
reimplement them, and we do **not** port HeroUI React's React-Aria-derived prop
surface or logic. The goal is that most components are near pass-through: a
Kobalte re-export plus theming, with little to no logic of our own. Fetch the
upstream React source (heroui-react MCP `get_component_source_code`, or the `v3`
branch of heroui-inc/heroui on GitHub) as a reference for *theming, variants,
and docs* — not as the API or behavior to mirror.

- **Expose Kobalte's prop names verbatim.** The pass-through base is Kobalte's
  own API (`open`/`onOpenChange`, `value`/`onChange`, `disabled`, `required`…).
  Don't rename them to HeroUI's (`isOpen`, `isDisabled`), don't add a HeroUI
  prop that only re-wraps a Kobalte prop, and don't reimplement RAC behavior
  HeroUI layered on top. `splitProps` peels off the variant/theming keys (plus
  any genuine HeroUI add-on); everything else spreads onto the Kobalte primitive
  untouched. When a component has no behavioral needs beyond Kobalte, prefer a
  direct re-export over a wrapper.
- **HeroUI-specific add-ons only.** The only things layered on top of the
  pass-through are what HeroUI provides and Kobalte doesn't: `@heroui/styles`
  variant/theming props, slot classes, the CSS-state bridges below, and
  HeroUI-only visual features. If a capability is really RAC's rather than
  HeroUI's, it already lives in Kobalte — don't re-add it. When unsure whether
  something is a HeroUI add-on or RAC behavior, treat it as Kobalte's and pass
  through.
- **Compound structure follows Kobalte's surface** where the pass-through
  exposes it — mirror the Kobalte primitive's parts, not HeroUI React's, when
  the two diverge. (Packaging conventions like the `index.ts` compound layout
  below are unaffected.)
- **Demos (and docs) express ONLY our public API — never upstream's internals.**
  A ported demo uses our compound parts and their props and nothing else:
  content goes straight into the part (`<Accordion.Content>{item.content}</…>`),
  and you reach for our add-on parts (`<Accordion.Indicator />`). Do **not**
  hand-stamp a slot/BEM class on a raw element
  (`<ChevronDown class="accordion__indicator">`) and do **not** reproduce
  upstream's internal DOM (`<div class="accordion__body"><div
  class="accordion__body-inner">…`). Those `*__slot` classes are the
  component's private implementation — fold any structure/padding/text styling
  a demo seems to need *into the component* (a part or its props, e.g. Content
  applying the `body`/`bodyInner` slots), not into the demo markup. (`data-slot`
  is a deliberate public styling hook and may be targeted from a demo's own
  classes.) **When a demo needs a capability our API doesn't expose, stop and
  flag it for evaluation** — never hand-roll the missing feature in the demo by
  reaching past the public parts. Adapt demos to our API; surface the gaps.

- **Port dependencies first, recursively.** Before porting component X, fetch
  X's upstream demos and enumerate every `@heroui/react` component they import
  or use in JSX (compound members included). Port any that are missing —
  applying this same rule to *their* demos — before X, so X's demos and docs
  page can follow upstream (content-wise, adapted to the Kobalte API). Never
  substitute or drop a dependency to make a demo "work".
- **A dependency gets the FULL port, never a minimal stub.** Pulling in
  component Y because X (or a demo) needs it means porting Y *completely*, to
  the same bar as any first-class port — not just enough of Y to render the
  one demo. Full means: the component + compound members, its docs page
  (following upstream's content, adapted to the Kobalte API), *all* of its
  upstream demos, and unit tests — driven to green (`bun nx test heroui-solid`,
  `ssr-test`, Biome). A dependency you only half-port silently drops Y's own
  demos and page, and the gap is invisible until someone audits it. If
  finishing Y's full port is genuinely out of scope for the current change,
  stop and ask — do not land a stub. The one exception is a demo that is itself
  React-impossible in Solid — skip it with a note on the docs page.
- **Icons: always use `gravity-icons-solid`** (the Solid port of
  `@gravity-ui/icons`, same icon names) when the icon exists there. Fall back
  to `unplugin-icons` only for icons gravity-icons-solid doesn't have.
  Upstream's icon package doesn't need to be matched — its iconify usage can
  map to whichever icon source fits.

- **File structure mirrors upstream**: `XRoot` naming, internal `XPrimitive`
  components, the same section banner comments where upstream has them,
  trailing `export {XRoot}` / `export type {XRootProps}`.
- **Import the Kobalte primitive under its own name** — `import { Link } from
  "@kobalte/core/link"`, `import { Accordion } from "@kobalte/core/accordion"`.
  Our wrapper is `XRoot` (and satellites are suffixed: `XItem`, `XIcon`), so the
  bare Kobalte name never clashes — don't alias it to `XPrimitive`. The compound
  `export const X` lives in `index.ts`, a different module, so it doesn't clash
  either.
- **Match upstream comment density** — which is near zero. No prop JSDoc
  unless the upstream file has it; no narrative prose. Necessary workaround
  notes stay inline, kept tight, when they're specific to that component.
  AGENTS.md carries the full story only for concerns that can affect other
  components (e.g. the single-read children rule), with a one-liner in the
  code pointing at it.
- **index.ts exports ONLY the compound** — nothing else is public. The compound
  `export const X = Object.assign(XRoot, { Root: XRoot, /* satellites */ })`, a
  merged `export type X = { Props: XRootProps; /* SatelliteProps */ }` built
  from the component file's exported prop types
  (not `ComponentProps<typeof XRoot>`), and the variants re-exported from
  `@heroui/styles`. Re-export the tv fn (`xVariants`) always; re-export the
  `XVariants` type only when the component actually has variants — skip it when
  the tv config is slots-only (see link). No named `XRoot`/satellite re-exports
  and no `XRootProps as XProps` alias: the compound plus variants is the whole
  package surface for the component. The named `XRoot`/`XRootProps` exports live
  on the component `.tsx` file (above) for the index to import — they just
  aren't re-exported onward.
- **Reuse `@heroui/styles` at runtime — never duplicate styling knowledge**:
  the tv functions (`buttonVariants`), `cn`, and the `XVariants` types are the
  exact code the React implementation uses. No local `*.styles.ts` modules, no
  convenience types upstream doesn't export.
- **`@heroui/styles` is a peerDependency, pinned exact (no `^`/`~`)** —
  consumers install it themselves (`bun add @heroui/styles heroui-solid`,
  mirroring the React quick start), and classes, `variantKeys`, and prop
  types all come from it at runtime, so bumps must be deliberate: update the
  peer + dev pins in packages/heroui-solid and the dependency in apps/docs
  (a consumer like any other — the exact peer requirement makes a mismatched
  bump fail at install), then re-run tests.
- **Variant keys are dynamic**: `splitProps(props, xVariants.variantKeys,
  [/* behavior keys */])` — the tv function exposes its config at runtime.
  Never hardcode a variant key list.
- **Class composition**: `class={cn(xVariants(variantProps), local.class)}`.
- **Behavior is Kobalte's, always** — not "where it adds value". Reach for the
  Kobalte primitive by default and let it own the behavior; `callHandler` from
  `@kobalte/utils` only when a HeroUI add-on genuinely must intercept a handler.
  Solid adaptations still apply wherever we do touch the surface: Kobalte `as`
  for React's `render` prop, `class` for `className`, `createSignal` for
  `useState`, `splitProps` instead of destructuring (destructuring kills
  reactivity).
- **Skip what isn't ported yet** (e.g. `BUTTON_GROUP_CHILD` until ButtonGroup
  exists) and React-only machinery (`dom.span`, `composeTwRenderProps`).
- **Don't mirror upstream a11y bugs.** Upstream's icons (icons.tsx on the
  `v3` branch) stamp `aria-label` on svgs that are *also* `aria-hidden="true"`
  + `role="presentation"` — the name is on an element erased from the
  accessibility tree, so it never surfaces. Keep the useful part, not the
  hiding: ported icons **keep the default `aria-label`** (overridable via the
  props spread) and set **`role="img"`** so the name is actually exposed, and
  **drop `aria-hidden` + `role="presentation"`**. Best practice for a
  meaningful svg is a labeled `role="img"`; the whole upstream icons.tsx is
  ported this way in `src/components/icons.tsx`, the shared icon source. A
  decorative placement — an icon inside an already-labeled control (a button, a
  link), where the label would just pollute the control's accessible name —
  opts back out by passing `aria-hidden="true"` through the spread at the call
  site (see the Accordion indicator's default chevron and Link's default arrow).
  Same approach for future upstream a11y defects: fix here, note the deviation,
  consider reporting upstream.
- **Form controls provide `FieldContext`** (`src/utils/field-context.tsx`,
  value `true`): the field satellites (Label, Description, FieldError, Input,
  TextArea) render the Kobalte form-control primitive when the marker is
  present and a plain element otherwise (Kobalte's primitives throw outside
  their provider). Every new Kobalte form-control root (Select, Checkbox…)
  must provide it. Also re-stamp `data-invalid/required/disabled/readonly`
  as `"true"` on the root — HeroUI CSS matches explicit values while Kobalte
  stamps empty strings, and props spread after Kobalte's dataset, so the
  re-stamp wins (see textfield.tsx); descendant-level Kobalte attrs are
  bridged in overrides CSS instead (see input.overrides.css).
- **Scroll-lock overlays with `PreventScroll`, never Kobalte's `preventScroll`.**
  Kobalte's lock (solid-prevent-scroll) sets `overflow: hidden` on `body`;
  when the scroll offset lives on `html` (the browser default), body becomes
  the nearest scroll container and every `position: sticky` element in the
  page snaps back to its in-flow position — the docs header visibly vanished
  while a dropdown was open. React Aria locks `html` instead, which freezes
  scrolling without breaking sticky. `src/utils/prevent-scroll.tsx` ports
  React Aria's `usePreventScroll` (from react-aria 3.50): ref-counted, with
  the standard path (`overflow: hidden` + `scrollbar-gutter`/padding
  compensation on `documentElement`) and the full Mobile Safari path
  (capture-phase `touchmove` prevention outside scrollables, injected
  `overscroll-behavior: contain` layer — required before touchstart as of
  iOS 26 — and focus/keyboard handling via a temporary
  `HTMLElement.prototype.focus` override). iOS behavior is covered by jsdom
  tests with a mocked platform (prevent-scroll.test.tsx), not a real device
  — re-verify on Safari when it matters. Usage: pass
  `preventScroll={false}` to the Kobalte root where it defaults on (Menu
  does; Select doesn't) and render `<PreventScroll />` as the first child of
  the portal'd content — mount/cleanup then spans exactly the content's
  presence, and it's SSR-inert (see dropdown.tsx, select.tsx).
- **Never depend on react-aria/`@react-types`, even types-only**: public d.ts
  references force it into consumers' deps (dragging React peer deps into
  Solid apps), and its prop types are React-shaped (`ReactNode`). Write the
  small framework-neutral shapes inline (e.g. `{ isPending: boolean }`).
  Framework-agnostic satellites like `@internationalized/date` are fine as
  real deps when a component needs them.
- **HeroUI CSS state selectors need bridging — audit every port.** Upstream
  CSS keys interactive states off React Aria attributes (`data-focus-visible`,
  `data-hovered`, `data-pressed`, `data-selected`…) that Kobalte doesn't stamp
  (Button stamps only `data-disabled`), and some native fallbacks are dead
  selectors (`:focus-visible:not(:focus)` never matches) — states silently
  no-op (buttons shipped with no focus ring). Grep
  `node_modules/@heroui/styles/dist/components/<x>.css` for `data-` selectors,
  then bridge in a colocated `<x>.overrides.css` (working pseudo-class or
  Kobalte's attrs → `@apply` the same HeroUI utility, e.g.
  `.button:focus-visible { @apply status-focused; }`) registered in the
  `src/styles/overrides.css` barrel with `layer(overrides)`. The package
  ships NO compiled CSS: `heroui-solid/styles` exports the source entry
  (`src/styles/styles.css` — an `@layer overrides` statement plus the
  barrel), and the consumer's own Tailwind v4 pass compiles it after
  `@import "tailwindcss"` and `@import "@heroui/styles"` (quick-start order);
  the `@apply`'d heroui utilities resolve against @heroui/styles' `@utility`
  defs in that same pass, and `overrides` appends after the upstream layers
  so bridges beat the `components` layer. `src` is in package.json `files`
  for exactly this reason.
- **Focus-ring bridges must be modality-gated — bare `:focus-visible` is
  wrong wherever Kobalte moves focus programmatically.** Kobalte focuses
  options on pointer hover (Select/Menu) and refocuses triggers on close,
  and Chromium's :focus-visible heuristic follows programmatic focus moves —
  ungated bridges ringed hovered options and mouse-dismissed triggers.
  `src/utils/interaction-modality.ts` (trimmed port of React Aria's global
  modality tracker) stamps `data-heroui-modality="keyboard"|"pointer"` on
  `<html>`; ring bridges select with
  `html:not([data-heroui-modality="pointer"]) .x:focus-visible` and the
  components that move focus (Select, Dropdown, ListBox) install the tracker
  in `onMount`. Absent attribute = gate no-op, so lone Buttons keep native
  behavior. Text inputs stay ungated on purpose — browsers correctly ring
  them on mouse click, as upstream does.
- **Never bridge Kobalte's `data-highlighted` to hover styles.** It's
  virtual focus, not hover: it rides keyboard navigation and lands on the
  selected item the moment a Select/Menu opens, so a
  `[data-highlighted] → bg-default` bridge paints the hover background with
  no pointer anywhere near (selected option lit up on open). Upstream's
  hover bg is pointer-only (`:hover`/`data-hovered` inside
  `@media (hover: hover)`) and the native `:hover` half already works here
  with no bridging — so hover needs NO override at all, and keyboard
  highlight is only the modality-gated focus ring above. Applies to every
  collection port (ListBox, Menu; future ComboBox, Autocomplete…).

## Solid SSR/Hydration Rules (hard-won — violations cost a full day)

- **Read the `children` prop exactly once per evaluation.** Children are
  create-on-access getters; a bare `typeof props.children` ternary in JSX
  compiles into two reads, creating children twice and desyncing SSR hydration
  keys ("Hydration Mismatch", then "template is not a function" cascades).
  Capture to a local first, or forward via a single-read `get children()` in
  `mergeProps` (see button.tsx).
- **No component-level `children()` helper for conditionally rendered content.**
  Server memos evaluate eagerly at creation while client memos stay lazy, so a
  `children(() => props.children)` created during component setup resolves the
  children during SSR even when the branch that would insert them never renders
  (e.g. an unselected `ListBox.ItemIndicator` with a custom icon). The
  server-side creation consumes hydration context ids the client never
  consumes — every later element desyncs and hydration crashes with
  `getNextElement()` / "template is not a function" (no "Hydration Mismatch"
  line first). Fix: evaluate children only inside the conditionally rendered
  position, with a single read (IIFE child in list-box.tsx
  ListBoxItemIndicator). Helpers created and *always* read in render (Select's
  indicator) are fine — both sides evaluate consistently.
- **Never evaluate closed portal/popover content during SSR or hydration.**
  Content behind a closed Kobalte `Portal`/`Content` is not in the SSR
  payload, so any eager evaluation of it while hydrating creates DOM whose
  hydration-key lookups find nothing — the mismatch crash. Merely *accessing*
  the children getter creates native-element children (compiled IIFEs), and
  the `children()` helper (or any context `Provider`, which deep-resolves)
  also forces Kobalte's deferred `Dynamic` trees. Select needs popover
  children evaluated during render anyway (items must register before Kobalte
  refuses to open with zero options, and before its deferred
  prune-selection effect first subscribes — registering in `onMount` instead
  makes that effect fire a spurious `onChange`, since Kobalte Select defaults
  `allowDuplicateSelectionEvents: true`). The escape hatch: components inside
  the popover resolve to plain **marker objects**, not JSX — `ListBox.Item`
  yields an item descriptor, and `ListBox` itself yields a render marker
  (`LIST_BOX_RENDER` in list-box.tsx) whose `render()` the popover only calls
  inside the content, once it actually opens (client-side, post-hydration).
  Corollary: `Select.Popover` children must resolve to markers/descriptors —
  a bare `<div>` child would crash hydration again. Grouped options
  (`Select` + `ListBox.Section`) extend this: the section resolves to a
  descriptor whose `items` register as a Kobalte group (`optionGroupChildren`),
  but its `<Header>` and any `<Separator>` between sections would create DOM
  during that eager registration — so both return **deferral markers** when
  inside a Select collection (`utils/collection-defer.tsx`,
  `CollectionDeferContext` provided by Select.Root; the marker's `render()`
  runs only in the Select's `sectionComponent`, on open). Any new node that
  can sit inside a Select's ListBox and would otherwise emit DOM must defer the
  same way; `renderDeferred` unwraps them at the render site.
- **Mid-hydration reactive updates don't reach the DOM — element creations
  crash, text writes are silently dropped.** Select item registration happens
  while the page is still hydrating, and anything reacting to it must cope:
  Kobalte's `HiddenSelect` renders an `<option>` per item, but the server
  froze its collection empty (server memos never re-run), so it's rendered
  client-only after mount (`Show when={mounted()}` in select.tsx — the SSR'd
  hidden select was valueless anyway). `Select.Value`'s text is worse: the
  mid-hydration update settles Kobalte's value memo on the final text while
  the DOM write is dropped (`insertExpression` returns early under
  `sharedConfig.context`), so a post-mount re-read produces an *equal* memo
  value and never patches — the trigger stays blank. Fix: mirror SSR's empty
  text until `mounted()`, so the memo value actually changes after hydration
  (see SelectValue in select.tsx).
- **MDX authoring (apps/docs)**: no `import` statements in `.mdx`; no JSX
  children of components written in MDX — multiline children get
  paragraph-wrapped by MDX (`<Button>\nText\n</Button>` becomes
  `<Button><p>Text</p></Button>`) and render-prop children loop children
  resolution. Demos are TSX files in `apps/docs/src/demos/<component>/`,
  registered in `src/demos/index.ts`, rendered via
  `<ComponentPreview name="component-demo" />` (same structure as official
  HeroUI docs; docs page content mirrors the official pages verbatim, adapted
  only for documented API differences). Demo file names, exports, and
  registry keys mirror upstream exactly — check
  `apps/docs/src/demos/en/<component>/` on the heroui `v3` branch before
  naming anything. The file name is upstream's (`default.tsx`,
  `on-surface.tsx`, `with-error.tsx` — not `usage.tsx`/`in-surface.tsx`), the
  export is upstream's exact function name (`Variants`, `Default`,
  `OnSurface` — including upstream's occasional prefixes like `SpinnerBasic`,
  `LinkBasic`), and the registry key is `<component>-<file-stem>`
  (`card-default`), same as upstream's `<ComponentPreview name>`. Function
  names repeat across components, so `index.ts` aliases on import
  (`import { Variants as CardVariants } from "./card/variants"`). Demos with
  no upstream counterpart follow the same conventions.
- **Component usage examples import the demo source — never inline it.** The
  ```` ```tsx ```` block under each `<ComponentPreview />` must be
  ```` ```tsx file=../../../demos/<component>/<demo>.tsx title="" ```` with an
  empty body (solidbase's built-in remark-code-import). The demo file is the
  single source of truth; `title=""` suppresses the auto filename tab
  (duplicate meta keys resolve last-wins; the official docs show untitled
  blocks — `title=null` would render a literal "null" tab). Exception:
  teaching snippets (partial code, `...` placeholders, no `export function`)
  stay inline. Caveat: editing a demo doesn't HMR the imported code block —
  touch the `.mdx` or restart dev to see it. Demos may use Tailwind classes:
  the docs app compiles its own utilities (`src/tailwind.css`, referencing
  heroui's theme keys) — heroui-token utilities like `text-muted` work, but
  check unfamiliar ones exist in the theme (no `--color-primary`, e.g.).
- **Debugging hydration**: it's diagnosable without a browser — curl the dev
  server and compare `data-hk` key suffixes between SSR HTML and the client's
  expected key from the console error. HMR masks hydration bugs entirely
  (client re-render, no hydration) — always verify with a full page reload.
  The dev-mode "Hydration Mismatch ... Layout.jsx" console error on every page
  is an upstream SolidBase bug; don't confuse it with real breakage.
- **Known wart**: Kobalte's Button stamps `type="button"` on non-button `as`
  elements in SSR HTML (ref-based tag detection can't run server-side); the
  client removes it after mount. Upstream issue, not fixable from our side.

## Docs CSS Cascade (apps/docs)

- All `@kobalte/solidbase` CSS is demoted into `@layer solidbase` by the
  postcss plugin in `apps/docs/vite.config.ts`; the `@layer` statement at the
  top of `apps/docs/src/app.css` orders it `base < solidbase < components`,
  so heroui components beat the docs theme and the theme beats the preflight.
  Without this, solidbase's unlayered rules (e.g. reset.css
  `button { font: inherit }`) silently override heroui's layered styles.
- The docs chrome is themed via the `--sb-*` → heroui token remap in
  `app.css` (unlayered `:root`, wins in both modes — both systems key dark
  off `html[data-theme]`). Restyle chrome by extending that remap, not by
  editing solidbase CSS.
- **Dark mode is HeroUI-native `data-theme="dark"|"light"` (exact), owned by
  `src/theme/theme.ts` — NOT solidbase's theme system.** heroui keys dark mode
  (and `color-scheme`) off the exact attribute; solidbase instead stamps
  `data-theme="sdark"/"slight"` (s = "follow the OS") from a cookie, values
  heroui's exact CSS never matches. Reconciling the two used to require a
  postcss substring rewrite of heroui's selectors plus an early inline script,
  and it still flashed: on a static prerender the server can't know the OS, and
  solidbase's own theme listener (baked into DefaultLayout, not removable
  without patching) writes `sdark` mid-hydration, briefly losing heroui's
  `[data-theme="dark"]` cascade to the always-on `:root { color-scheme: light }`
  → one light frame. The rewrite is gone; the whole scheme is now:
  - `THEME_INIT_SCRIPT` (in `theme.ts`, injected as the **first `<head>` child**
    by `entry-server.tsx`) runs before any CSS: reads `localStorage["theme"]`
    (`light`/`dark`/`system`, default `system`), resolves to exact
    `dark`/`light`, sets `data-theme` **and** pins `style.color-scheme` (so the
    pre-CSS UA canvas matches the choice, not the OS). It installs a
    `MutationObserver` that re-applies our resolved value on any write — that's
    what neutralizes solidbase's `sdark`/`slight` writes — plus a `matchMedia`
    listener for live OS changes in `system` mode. No cookies (useless on a
    static prerender).
  - `ThemeToggle` (`theme/theme-toggle.tsx`) drives `theme.ts`
    (`setPreference`/`preference`/`initThemeManager`), not solidbase's
    `setTheme`/`getThemeVariant`.
  - CSS keys on exact `[data-theme="dark"]` everywhere: the `dark` custom-variant
    in `tailwind.css`, `app.css`, `docs-theme.css`. heroui's CSS still enters
    through the consumer-style Tailwind entry (`src/tailwind.css`:
    tailwindcss → @heroui/styles → heroui-solid/styles, the published
    quick-start). Solidbase's own CSS keeps `[data-theme*="dark"]` (its Preview
    module) — harmless, `*="dark"` still matches our exact `"dark"`.
  - `entry-server.tsx` renders `<html … data-theme="light">` as the no-JS
    fallback (spread `getHtmlProps()` first so its lang wins but our explicit
    attribute replaces solidbase's `getTheme()` "ystem" bug).

## Docs Search (apps/docs)

- Static search, fumadocs-style: `search-index.ts` parses the MDX routes from
  disk at vite-config time (a `?raw` glob doesn't work — the MDX pipeline owns
  `.mdx` imports even with the query) into `virtual:docs-search-index`;
  `src/routes/api/search.ts` serves it and nitro prerenders it to
  `.output/public/api/search` (nitro's `prerender.routes` **replaces** the
  crawler's `/` start point, so `/` must stay listed alongside it). The client
  (`src/theme/search.tsx`) fetches the JSON once on first open and queries
  `@orama/orama` in-browser. Like the sidebar, the index is computed once per
  dev-server start — content edits reach search after a restart.
- The header is the only default-theme component with no slot for a centered
  search bar, so `src/theme/header.tsx` is a copy of solidbase's Header
  (reusing its module CSS from the package) registered via the same
  components provider as ThemeSelector; the search cluster layout lives in
  docs-theme.css, and the trigger replicates heroui.com's own unlayered
  `#nd-subnav [data-search-full]` override of the fumadocs base classes —
  borderless field-token pill, text-only hover — not the bordered fumadocs
  defaults the markup's class list suggests (docs-theme.css
  `.search-toggle`; the field tokens ship in our @heroui/styles runtime with
  identical values). The ⌘K dialog is Kobalte Dialog with
  `preventScroll={false}`
  + `PreventScroll` (exported from heroui-solid for this) and is closed during
  SSR, so it's hydration-inert.

## Docs Deploy (GitHub Pages)

- `.github/workflows/deploy-docs.yml` builds `apps/docs` on every push to
  `main` and publishes `.output/public` to
  https://daveycodez.github.io/heroui-solid/ (Pages is set to the
  "GitHub Actions" source; the README links there).
- Project Pages live under `/<repo>/`, so the build takes an optional
  `DOCS_BASE_PATH` env var (unset locally/dev — everything stays at `/`).
  It drives vite `base`, the Router `base` in app.tsx (trailing slash
  stripped — solid-router would emit `//` doubles), and nitro `baseURL`
  (prerender fetches with the base, writes files without it).
- **Any root-absolute URL in docs source must go through `withBase`**
  (`src/theme/base.ts`) or a Router-resolved `<A>`: plain `<a href="/docs/…">`
  bypasses the Router base and 404s under the subpath. This includes MDX
  content links — `mdx-components.tsx` overrides the theme's `a` to prefix
  them — and `useMatch` patterns, which compare against the full pathname
  (see header-docs-link.tsx).
- Upstream base-path gaps are patched by the `deploy-base-patches` vite
  transform (no-op when base is `/`): solid-start's prod SSR manifest and
  its `stripBaseUrl` off-by-one (API routes 404'd, so `/api/search`
  prerendered as an HTML shell), and solidbase's `usePrevNext`/Article
  prev-next links. The patches string-match dist internals, and each one
  asserts its pattern actually matched — a based build fails loudly (naming
  the pattern and file) when a bump of `@solidjs/start`,
  `@kobalte/solidbase`, or `nitro` reshapes the matched text, whether the
  upstream bug was fixed (delete the patch) or still present in new
  wording (re-target the pattern).
- The docs `build` nx target keys its cache on `DOCS_BASE_PATH` (nx.json
  `inputs`), so based and un-based builds don't cross-restore.

## Dev Loop

- **`nx dev docs` is the whole docs dev loop** — no package build, watcher, or
  `dist`. The docs vite config aliases `heroui-solid` → its **source**
  (`src/index.tsx`, serve only) so the package compiles inside the docs app's
  own vite graph, and the docs tsconfig `paths` points there too, so runtime
  and editor types are both instant (a new/renamed export shows up with no
  rebuild). `resolve.dedupe: ["solid-js"]` keeps one Solid instance across the
  boundary (bun's isolated linker would otherwise give each side its own copy).
- **Editing package `.tsx` full-reloads the page; it does NOT hot-swap.** The
  `docs-dev-hmr` plugin's `handleHotUpdate` returns `[]` + sends a
  `full-reload` for any change under `packages/heroui-solid/src/**/*.tsx`. This
  is deliberate and load-bearing: solid-refresh can't hot-replace the package's
  `Object.assign` compound components across the module boundary — a
  fine-grained HMR feeds a half-swapped module in and crashes with
  `Cannot read properties of undefined (reading 'name')` (systemic: 34/38
  components use the compound). A full reload sidesteps solid-refresh entirely
  and is ~instant for a docs page. Verified with a headless playwright probe
  (edit source → clean reload, no crash). Demo edits and CSS overrides are
  **not** matched by the reload rule, so they still hot-HMR: package CSS
  (`heroui-solid/styles` → `src/styles` via package exports) flows through the
  docs' own Tailwind pass, no CSS build.
- `optimizeDeps.include: ["heroui-solid"]` does **not** work — vite refuses to
  pre-bundle a linked workspace ESM package (`Cannot optimize dependency`), so
  the "pre-bundle → vite full-reloads on dep change" trick isn't available;
  the `handleHotUpdate` above is why we don't need it.
- External projects consuming via `bun link` read `dist/` for JS — run
  `nx dev heroui-solid` (vite bundle + tsc jsx/dts watchers) for that
  workflow; styles resolve from `src` directly, no build step.
- When checking Biome from scripts, surface the exit code — don't pipe output
  through `tail`/`grep` in a way that swallows failures.
- **`bun run test:all` is the single CI entry point** (also run by
  .github/workflows/ci.yml on every PR): Biome over the repo, every project's
  unit tests, typecheck, and the SSR/hydration gate below.
- **`bun nx run docs:ssr-test` is the SSR/hydration gate** — the package's
  jsdom unit tests client-render only and cannot catch hydration bugs. The
  gate boots a dev server on :3199 and, in headless Chrome, loads `/ssr-test`
  (apps/docs/src/routes/ssr-test.tsx — renders every demo in the registry, so
  new demos are covered automatically) plus every docs page, failing on
  hydration-crash signatures: non-noise console/page errors, an empty `#app`
  (Solid wipes the page when hydration throws), or a demo section losing its
  SSR content (script: apps/docs/scripts/ssr-test.mjs; it filters solidbase's
  known benign dev-only Layout mismatch warning). Run it after touching any
  component render path and before/after dependency bumps (`@kobalte/core`,
  `solid-js`, `@solidjs/start`, `@heroui/styles`). Requires Google Chrome
  (`CHROME_PATH` to override). Verified to catch the eager-children-helper
  class of bug: reintroducing it fails the gate with "template is not a
  function" + per-demo diagnostics.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->