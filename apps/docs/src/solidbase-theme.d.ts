// @kobalte/solidbase's "./default-theme/*" export map points at extensionless
// files, which Vite resolves but TypeScript cannot; mirrors dist/default-theme/Layout.d.ts.
// Remove once https://github.com/kobaltedev/solidbase/issues/157 is fixed.
declare module "@kobalte/solidbase/default-theme/Layout" {
  import type { JSX, ParentProps } from "solid-js"

  const Layout: (props: ParentProps) => JSX.Element
  export default Layout
}
