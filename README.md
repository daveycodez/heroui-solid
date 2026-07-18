# heroui-solid

**Unofficial** [SolidJS](https://solidjs.com) port of [HeroUI v3](https://heroui.com).

**Docs & live previews:** <https://daveycodez.github.io/heroui-solid/>

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

Requires [Tailwind CSS v4](https://tailwindcss.com/docs/installation/framework-guides),
same as HeroUI for React.

```bash
bun add @heroui/styles heroui-solid
```

Then add to the CSS file your Tailwind build compiles (import order matters):

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "heroui-solid/styles";
```

`@heroui/styles` is HeroUI's own stylesheet, exactly as a React app consumes it;
`heroui-solid/styles` adds only the small overrides layer bridging HeroUI's
interactive-state CSS onto Kobalte's attributes. Your Tailwind pass compiles both, so
HeroUI's theme tokens are also available as utilities in your own markup
(`text-muted`, `bg-surface`, …).

## Usage

```tsx
import { Button } from "heroui-solid";

<Button variant="primary" size="md">Click me</Button>;
```

Full documentation and live previews are at
[daveycodez.github.io/heroui-solid](https://daveycodez.github.io/heroui-solid/)
(deployed from `main` by the Deploy Docs workflow). To run the docs app
(`apps/docs`) locally:

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
bun nx run-many -t build   # build library and docs
bun nx test heroui-solid
bun run lint
```

## License

[Apache-2.0](./LICENSE). See [NOTICE](./NOTICE) for HeroUI and Kobalte attribution.
