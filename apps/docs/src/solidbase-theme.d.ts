// @kobalte/solidbase's "./default-theme/*" export map points at extensionless
// files, which Vite resolves but TypeScript cannot; mirrors dist/default-theme/Layout.d.ts.
// Remove once https://github.com/kobaltedev/solidbase/issues/157 is fixed.
declare module "@kobalte/solidbase/default-theme/Layout" {
  import type { JSX, ParentProps } from "solid-js"

  const Layout: (props: ParentProps) => JSX.Element
  export default Layout
}

// Mirrors dist/default-theme/context.d.ts (DefaultThemeComponentsProvider
// only — the piece Layout.tsx uses to swap header component slots).
declare module "@kobalte/solidbase/default-theme/context" {
  import type { Component, JSX } from "solid-js"

  const DefaultThemeComponentsProvider: (props: {
    components?: Partial<Record<string, Component>>
    force?: boolean
    children?: JSX.Element
  }) => JSX.Element

  export { DefaultThemeComponentsProvider }
}
