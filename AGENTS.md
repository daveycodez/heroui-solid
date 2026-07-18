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

Mirror the official HeroUI React source as closely as possible, adapting only
what Solid requires. Fetch the source before porting (heroui-react MCP
`get_component_source_code`, or the `v3` branch of heroui-inc/heroui on GitHub).

- **Port dependencies first, recursively.** Before porting component X, fetch
  X's upstream demos and enumerate every `@heroui/react` component they import
  or use in JSX (compound members included). Port any that are missing —
  applying this same rule to *their* demos — before X, so X's demos and docs
  page can mirror upstream exactly. Never substitute or drop a dependency to
  make a demo "work".
- **Icons: always use `gravity-icons-solid`** (the Solid port of
  `@gravity-ui/icons`, same icon names) when the icon exists there — it's what
  the parity import mapping expects. Fall back to `unplugin-icons` only for
  icons gravity-icons-solid doesn't have.

- **File structure mirrors upstream**: `XRoot` naming, internal `XPrimitive`
  components, the same section banner comments where upstream has them,
  trailing `export {XRoot}` / `export type {XRootProps}`.
- **Match upstream comment density** — which is near zero. No prop JSDoc
  unless the upstream file has it; no narrative prose. Necessary workaround
  notes stay inline, kept tight, when they're specific to that component.
  AGENTS.md carries the full story only for concerns that can affect other
  components (e.g. the single-read children rule), with a one-liner in the
  code pointing at it.
- **index.ts uses the official compound layout**:
  `export const X = Object.assign(XRoot, { Root: XRoot })`, a merged
  `export type X = { Props: ComponentProps<typeof XRoot>; RootProps: ... }`
  (`ComponentProps` from solid-js), named `XRoot` export,
  `XRootProps as XProps` alias, and variants re-exported from `@heroui/styles`.
- **Reuse `@heroui/styles` at runtime — never duplicate styling knowledge**:
  the tv functions (`buttonVariants`), `cn`, and the `XVariants` types are the
  exact code the React implementation uses. No local `*.styles.ts` modules, no
  convenience types upstream doesn't export.
- **`@heroui/styles` is pinned to an exact version (no `^`/`~`)** — classes,
  `variantKeys`, and prop types all come from it at runtime, so bumps must be
  deliberate: update the pin, re-run tests, and re-check docs parity.
- **Variant keys are dynamic**: `splitProps(props, xVariants.variantKeys,
  [/* behavior keys */])` — the tv function exposes its config at runtime.
  Never hardcode a variant key list.
- **Class composition**: `class={cn(xVariants(variantProps), local.class)}`.
- **Behavior**: Kobalte primitives where they add value (our React Aria
  equivalent); `callHandler` from `@kobalte/utils` when intercepting handlers.
  Standard adaptations: `onClick` for `onPress`, Kobalte `as` for React's
  `render` prop, `class` for `className`, `createSignal` for `useState`,
  `splitProps` instead of destructuring (destructuring kills reactivity).
- **Skip what isn't ported yet** (e.g. `BUTTON_GROUP_CHILD` until ButtonGroup
  exists) and React-only machinery (`dom.span`, `composeTwRenderProps`).
- **Don't mirror upstream a11y bugs.** Upstream's icons (icons.tsx on the
  `v3` branch) stamp `aria-label` on `aria-hidden="true"` svgs — a name on an
  element erased from the accessibility tree. Ported icons drop the
  `aria-label` and keep `aria-hidden` + `role="presentation"` (see
  ExternalLinkIcon in link.tsx). Same rule for future upstream a11y defects:
  fix here, note the deviation, consider reporting upstream.
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
  `src/styles/overrides.css` barrel with `layer(overrides)`; rebuild with
  `bun run build:css`. `dist/styles.css` is the package's ONLY stylesheet —
  the barrel is imported by `src/styles/styles.css`, never compiled as its own
  entry (a split overrides-only entry was tried and removed; Tailwind
  `@reference` also re-emits the referenced stylesheet when nested under
  another entry's `@import`).

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
  a bare `<div>` child would crash hydration again.
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
- Solidbase stamps `data-theme="sdark"/"slight"` when following the OS
  (s-prefix = system), so the same postcss plugin rewrites heroui's exact
  `[data-theme=dark|light]` selectors to substring matches (`*=`) — without
  it, heroui tokens stay light in system-dark mode. The rewrite is scoped to
  rules originating from `heroui-solid/dist` (per-rule source check, since
  the import is inlined into app.css): solidbase's own CSS must keep exact
  matches — its ThemeSelector tells "dark" from "sdark" to pick the trigger
  icon (a global rewrite rendered two moons).

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

## Docs Parity Tests (apps/docs/parity)

- `bun nx test docs` guards the mirror-upstream conventions above with
  deterministic pass/fail checks against upstream fixtures pinned in
  `parity/upstream.lock.json` — there is no acceptance baseline or override.
  Invariants (registry keys ↔ demo files ↔ `<ComponentPreview>` names, empty
  `file=` include under each preview); demos must match upstream's
  UI-framework imports, used components (compound members included), and
  text content; pages must match upstream's title, description, section
  headings, and previews. Structure/styling adaptations are invisible to
  the comparison by construction. Full docs in `apps/docs/parity/README.md`.
- A parity failure names the exact missing/extra imports, components, text,
  sections, or previews — fix the demo/page to match upstream. If a
  difference is a mechanical adaptation every port shares (a package mapping,
  a styling-only attribute), teach `parity/analyze.ts`; never special-case
  one component.
- **Strict manifest**: a missing upstream demo is a porting TODO and stays
  red until ported. The only excuse is a reasoned `skipDemos` entry in
  `parity/components.ts`, reserved for React-impossible demos
  (`custom-render-function`, virtualization…); stale skips fail too.
- Catch up with upstream via `bun apps/docs/parity/sync.ts --update` (re-pins
  to upstream HEAD); the scheduled `docs-parity.yml` workflow runs
  `sync.ts --check` and files an issue when upstream's tracked files move.
- New ported component: add it to `parity/components.ts`, sync, port until
  green.

## Dev Loop

- `nx dev docs`: the docs vite config aliases `heroui-solid` to the package
  **source** in dev, so component edits HMR instantly — no package build or
  restart. The one-shot `^build` at startup only provides `dist/styles.css`
  and `.d.ts` for editor types. Package CSS edits need `bun run build:css`
  (or the `dev:css` watcher).
- External projects consuming via `bun link` read `dist/` — run
  `nx dev heroui-solid` (vite bundle + tsc jsx/dts + CSS watchers) for that
  workflow.
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