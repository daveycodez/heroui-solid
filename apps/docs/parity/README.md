# Docs parity with upstream HeroUI

These tests keep `apps/docs` mirroring the official HeroUI docs
(`heroui-inc/heroui`, `v3` branch) and catch any deviation — ours or theirs.
Every check is deterministic pass/fail: there is no acceptance baseline and
no override.

## How it works

- **`upstream.lock.json`** pins an upstream commit and records a blob sha for
  every tracked file (each ported component's MDX page + demo directory).
- **`sync.ts`** vendors those files into `fixtures/` (gitignored) at the pinned
  sha. The test globalSetup resyncs automatically when fixtures are missing or
  stale, so `bun nx test docs` just works on a fresh checkout.
- **`analyze.ts`** extracts, from both sides, the facets that survive the
  mechanical React→Solid adaptation untouched. Structure and styling never
  enter the comparison, so `className`→`class`, render-prop removal, data
  arrays + `<For>` instead of repeated literals, and style objects produce no
  noise by construction.
- **`parity.test.ts`** compares those facets:
  - **Strict manifest** — every upstream demo exists locally. The only escape
    is a reasoned `skipDemos` entry in `components.ts`, reserved for demos
    that *cannot* exist in Solid (React-only APIs/dependencies). Stale skips
    fail too, so the list can't rot.
  - **Demos** — for each ported demo, three sets must equal upstream's:
    the named imports from the UI framework (`heroui-solid` ↔
    `@heroui/react`; type-only imports ignored), the capitalized JSX
    components used (compound members included, e.g. `ListBox.ItemIndicator`),
    and the text content (JSX text + string literals, excluding
    `class`/`className`/`style` values). Icons are exempt: imports from icon
    packages (`@iconify/react`, `@gravity-ui/icons`, `gravity-icons-solid`,
    `~icons/*`) aren't compared, and JSX elements rendering those imports are
    skipped whole — upstream's `<Icon icon="devicon:google" />` vs a local
    `<GoogleIcon />` is a mechanical adaptation, not a difference. A missing
    `Avatar`, a dropped item, or invented copy each fail with the exact
    missing/extra entries named.
  - **Pages** — title and description must equal upstream's; every upstream
    section heading and `<ComponentPreview>` must exist locally (those
    belonging to skipped or still-unported demos are excused — the latter
    already fail the manifest). Local-only additions (e.g. "Differences from
    HeroUI React") are allowed; prose bodies and API tables are not compared —
    the port's API genuinely differs and is documented there.
- **`invariants.test.ts`** checks the local conventions with no fixtures
  needed: registry keys ↔ demo files ↔ `<ComponentPreview>` names, and the
  empty `file=` code-include under each preview.

## Workflows

**"has no unported upstream demos" failed** — port the listed demos (mirror
upstream's file name and export, register them, add the page section), or if
the demo is impossible in Solid, add a `skipDemos` entry with its reason in
`components.ts`.

**A demo or page test failed** — the assertion names the exact missing/extra
imports, components, text, sections, or previews. Fix the demo/page to match
upstream. If a difference is a *mechanical* adaptation every port shares
(a new package mapping, another styling-only attribute), teach `analyze.ts`;
never special-case a single component.

**Catching up with upstream** — re-pin and refetch:

```sh
bun apps/docs/parity/sync.ts --update
bun nx test docs        # failing components = pages upstream changed
```

CI runs `sync.ts --check` on a schedule and opens/updates an issue when
upstream's tracked files move.

**Porting a new component** — add it to `components.ts`, run
`sync.ts` (no flag: refetches at the locked sha), then port until green.
