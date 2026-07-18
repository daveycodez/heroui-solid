import { createSignal } from "solid-js"

// HeroUI-native theming for the docs. HeroUI keys dark mode off the exact
// attribute `data-theme="dark"|"light"` (and `color-scheme` on those exact
// selectors) — see https://heroui.com/docs/react/getting-started/theming. This
// is a static, prerendered site, so the server can't know the visitor's OS
// preference and there is no per-user cookie to read: the ONLY way to paint the
// right theme on the first frame is a blocking inline script that runs before
// any CSS. That script (THEME_INIT_SCRIPT) resolves the stored preference (or
// the OS) to an exact `data-theme` and applies it as the first thing in <head>.
//
// Solidbase ships its own theme listener (bundled into its DefaultLayout, not
// removable without patching node_modules) that writes `data-theme="sdark"`/
// `"slight"` from a cookie/matchMedia — values heroui's exact CSS never
// matches. We don't use it (our ThemeToggle drives this module instead), so the
// inline script also installs a MutationObserver that normalizes any write back
// to our resolved exact value. Because the observer re-resolves from OUR stored
// preference, an explicit "light" choice on a dark OS stays light regardless of
// what solidbase writes.

export type ThemePreference = "light" | "dark" | "system"

export const THEME_STORAGE_KEY = "theme"

// Kept in sync with THEME_INIT_SCRIPT below. Reused by the client manager so
// the resolution logic lives in one place at runtime (the inline script is a
// hand-minified copy that must run before the bundle loads).
export function resolveTheme(pref: ThemePreference): "light" | "dark" {
  if (pref === "light" || pref === "dark") {
    return pref
  }
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
  } catch {}
  return "system"
}

const [preference, setPreferenceSignal] =
  createSignal<ThemePreference>("system")

export { preference }

export function applyTheme() {
  const resolved = resolveTheme(preference())
  const el = document.documentElement
  if (el.getAttribute("data-theme") !== resolved) {
    el.setAttribute("data-theme", resolved)
  }
  // Pin color-scheme inline so the browser's default canvas (painted before
  // heroui's render-blocking CSS applies) matches the resolved theme instead of
  // the OS preference — otherwise a light-on-dark-OS choice flashes one frame.
  if (el.style.colorScheme !== resolved) {
    el.style.colorScheme = resolved
  }
}

// Called on mount to adopt whatever the inline script already resolved (so the
// reactive toggle reflects the real stored preference after hydration).
export function initThemeManager() {
  setPreferenceSignal(readPreference())
  const mq = window.matchMedia("(prefers-color-scheme: dark)")
  const onChange = () => applyTheme()
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

export function setPreference(pref: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref)
  } catch {}
  setPreferenceSignal(pref)
  applyTheme()
}

// Blocking, dependency-free copy of the logic above. Injected as the first
// <head> child by entry-server.tsx and must run before any CSS paints. Keep it
// minified and in sync with resolveTheme/readPreference.
export const THEME_INIT_SCRIPT = `(()=>{try{var K="${THEME_STORAGE_KEY}",e=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)");function p(){try{var v=localStorage.getItem(K);return v==="light"||v==="dark"?v:"system"}catch(_){return"system"}}function r(){var v=p();return v==="system"?(m.matches?"dark":"light"):v}function a(){var t=r();if(e.getAttribute("data-theme")!==t)e.setAttribute("data-theme",t);if(e.style.colorScheme!==t)e.style.colorScheme=t}a();new MutationObserver(a).observe(e,{attributes:!0,attributeFilter:["data-theme"]});m.addEventListener("change",a)}catch(_){}})()`
