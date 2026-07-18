// Ports React Aria's global input-modality tracking (@react-aria/interactions
// focusVisible.ts, trimmed). Kobalte moves real DOM focus on pointer hover
// inside Select/Menu listboxes and refocuses triggers on close, and
// Chromium's :focus-visible heuristic follows programmatic focus moves — so
// bare :focus-visible bridges would paint keyboard focus rings during pure
// pointer interaction (hovered options ringed, trigger ringed after mouse
// dismiss). The tracker stamps data-heroui-modality="keyboard"|"pointer" on
// <html> and overrides CSS gates its ring bridges on it
// (`html:not([data-heroui-modality="pointer"])`). Like React Aria's, the
// listeners are global and permanent; components that move focus
// programmatically call this from onMount (SSR-inert).
let installed = false

const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta"])

export function setupInteractionModality() {
  if (installed || typeof document === "undefined") {
    return
  }
  installed = true
  const stamp = (modality: "keyboard" | "pointer") => {
    if (document.documentElement.dataset.herouiModality !== modality) {
      document.documentElement.dataset.herouiModality = modality
    }
  }
  window.addEventListener(
    "keydown",
    (event) => {
      if (!MODIFIER_KEYS.has(event.key)) {
        stamp("keyboard")
      }
    },
    true
  )
  window.addEventListener("pointerdown", () => stamp("pointer"), true)
  window.addEventListener("pointermove", () => stamp("pointer"), true)
}
