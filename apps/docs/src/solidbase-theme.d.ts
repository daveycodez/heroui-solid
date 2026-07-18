// @kobalte/solidbase's "./default-theme/*" export map points at extensionless
// files, which Vite resolves but TypeScript cannot; mirrors dist/default-theme/Layout.d.ts.
// Remove once https://github.com/kobaltedev/solidbase/issues/157 is fixed.
declare module "@kobalte/solidbase/default-theme/Layout" {
  import type { JSX, ParentProps } from "solid-js"

  const Layout: (props: ParentProps) => JSX.Element
  export default Layout
}

// Mirrors dist/default-theme/context.d.ts: the components provider Layout.tsx
// uses to swap header component slots, plus the hooks the Header copy
// (theme/header.tsx) consumes. Component types are loosened to Component —
// the concrete default-theme component types sit behind the same
// extensionless paths this file works around.
declare module "@kobalte/solidbase/default-theme/context" {
  import type { Accessor, Component, JSX, Setter } from "solid-js"

  const DefaultThemeComponentsProvider: (props: {
    components?: Partial<Record<string, Component>>
    force?: boolean
    children?: JSX.Element
  }) => JSX.Element

  export function useDefaultThemeComponents(): Record<string, Component>

  export function useDefaultThemeState(): {
    sidebarOpen: Accessor<boolean>
    setSidebarOpen: Setter<boolean>
    tocOpen: Accessor<boolean>
    setTocOpen: Setter<boolean>
    navOpen: Accessor<boolean>
    setNavOpen: Setter<boolean>
    frontmatter: Accessor<
      { sidebar?: boolean; toc?: boolean; [key: string]: unknown } | undefined
    >
  }

  export { DefaultThemeComponentsProvider }
}

// Mirrors dist/default-theme/utils.d.ts (useRouteConfig only — the piece
// theme/header.tsx uses for the logo/title and nav config).
declare module "@kobalte/solidbase/default-theme/utils" {
  import type { Accessor } from "solid-js"

  export function useRouteConfig(): Accessor<{
    title?: string
    logo?: string
    themeConfig?: {
      nav?: { text: string; link: string; activeMatch?: string }[]
    }
  }>
}
