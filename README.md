# heroui-solid

**Unofficial** [SolidJS](https://solidjs.com) port of [HeroUI v3](https://heroui.com).

## What it is

- **HeroUI's look, HeroUI's API.** Components mirror HeroUI v3's real public API
  (`variant`, `size`, `isDisabled`, `isPending`, compound parts like `Card.Header` /
  `Card.Content`), styled by HeroUI's own CSS from the
  [`@heroui/styles`](https://www.npmjs.com/package/@heroui/styles) package — updating that
  package restyles this library.
- **[Kobalte](https://kobalte.dev) behavior.** Stateful widgets (Select, Dropdown,
  ComboBox, TextField…) are built on Kobalte for accessibility and keyboard interactions.
  Presentational components are plain styled markup.

## Install

```bash
bun add heroui-solid solid-js
```

Then import the stylesheet once (no Tailwind required):

```ts
import "heroui-solid/styles";
```

The stylesheet is self-contained — it bundles [`@heroui/styles`](https://www.npmjs.com/package/@heroui/styles)
(preflight, theme, and component CSS), so there is nothing else to install or import.

## Usage

```tsx
import { Button } from "heroui-solid";

<Button variant="primary" size="md">Click me</Button>;
```

Full documentation and live previews live in the docs app (`apps/docs`):

```bash
bun install
bun nx dev docs
```

## Monorepo layout

| Path | What |
|---|---|
| `packages/heroui-solid` | The publishable component library |
| `apps/docs` | Solidbase documentation site with live previews |

Built with Nx + bun; lint/format via biome.

```bash
bun install
bun nx run-many -t build   # build library (JS + CSS) and docs
bun nx test heroui-solid
bun run lint
```

## License

[Apache-2.0](./LICENSE). See [NOTICE](./NOTICE) for HeroUI and Kobalte attribution.
