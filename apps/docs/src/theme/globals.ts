import { createSignal } from "solid-js"
import { isServer } from "solid-js/web"

// Drop-in replacement for @kobalte/solidbase/dist/default-theme/globals.js,
// wired up by the redirect in vite.config.ts. Upstream calls onMount at
// module scope, creating a computation outside any root — Solid's dev build
// warns "computations created outside a `createRoot` or `render` will never
// be disposed" on every full page load — and its setTimeout initial flip can
// fire mid-hydration on viewports ≤ 1100px, desyncing Layout's Show branch
// and crashing Kobalte-based pages ("template is not a function"). See
// https://github.com/kobaltedev/solidbase/issues/152. Plain matchMedia
// listener (no reactive machinery at module scope) with the initial value
// deferred until the window load event so it can't race hydration.
const [_mobileLayout, setMobileLayout] = createSignal(false)

if (!isServer) {
  const query = window.matchMedia("(max-width: 1100px)")
  query.addEventListener("change", (event) => setMobileLayout(event.matches))
  const apply = () => setTimeout(() => setMobileLayout(query.matches))
  if (document.readyState === "complete") {
    apply()
  } else {
    window.addEventListener("load", apply, { once: true })
  }
}

export const mobileLayout = _mobileLayout
