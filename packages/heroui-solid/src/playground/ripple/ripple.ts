import { onCleanup } from "solid-js"

/**
 * Material 3 ripple, extracted from heroui-solid's Button so the shipped
 * component can stay a thin Kobalte pass-through. This is a parked, standalone
 * experiment — nothing in the published package imports it.
 *
 * Timings (after m3-ripple): how long a touch must hold (or how fast it must
 * lift) before it counts as a press rather than a scroll; press-point →
 * grown-and-centered growth; fade-in on press and fade-out on release, held for
 * at least MIN_PRESS so fast clicks still read as a full ripple.
 */
const RIPPLE_TOUCH_DELAY = 150
const RIPPLE_GROW_MS = 150
const RIPPLE_FADE_IN_MS = 75
const RIPPLE_FADE_OUT_MS = 375
const RIPPLE_MIN_PRESS_MS = 225

export type RippleHandlers = {
  onClick: (event: MouseEvent & { currentTarget: HTMLElement }) => void
  onPointerDown: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
  onPointerLeave: (event: PointerEvent) => void
  onPointerCancel: (event: PointerEvent) => void
}

/**
 * Wire the returned handlers onto an element (`on:click`, `on:pointerdown`, …).
 * Opt-in via the inherited `--button-ripple` flag (see `ripple.css`), so the
 * effect no-ops until a `.ripple` ancestor turns it on.
 *
 * Material 3 press lifecycle: `beginRipple` grows the ripple from the press
 * point toward the center (`fill: forwards` keeps it while held) and fades it
 * in; `endRipple` fades it out on release, no sooner than MIN_PRESS after the
 * grow started. Touch arms a short delay so a press that becomes a scroll
 * (pointercancel) never ripples, while both a quick tap (release beats the
 * delay) and a sustained hold do. Keyboard activation ripples from the center
 * via the synthesized click (detail 0). Cosmetic, client-only, no-ops when off.
 */
export function createRipple(): RippleHandlers {
  let rippleTouch: { x: number; y: number } | undefined
  let rippleTimer: ReturnType<typeof setTimeout> | undefined
  let rippleEndTimer: ReturnType<typeof setTimeout> | undefined
  let rippleGrow: Animation | undefined
  let rippleFade: Animation | undefined
  let rippleStartedAt = 0
  let rippleHeld = false
  onCleanup(() => {
    clearTimeout(rippleTimer)
    clearTimeout(rippleEndTimer)
  })

  const beginRipple = (el: HTMLElement, x?: number, y?: number): void => {
    const style = getComputedStyle(el)
    if (!(Number.parseFloat(style.getPropertyValue("--button-ripple")) > 0))
      return
    if (
      typeof el.animate !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    const width = el.offsetWidth
    const height = el.offsetHeight
    const maxDim = Math.max(width, height)
    const cx = x ?? width / 2
    const cy = y ?? height / 2
    // m3-ripple's geometry: start at 20% of the larger dimension, end fully
    // covering from the center with padding plus the soft-edge band.
    const startRadius = (0.2 * maxDim) / 2
    const endRadius =
      (Math.hypot(width, height) + 12 + Math.max(0.35 * maxDim, 75)) / 2
    const opacity =
      Number.parseFloat(style.getPropertyValue("--button-ripple-opacity")) ||
      0.12
    clearTimeout(rippleEndTimer)
    rippleEndTimer = undefined
    rippleGrow?.cancel()
    rippleFade?.cancel()
    rippleHeld = true
    rippleStartedAt = performance.now()
    rippleGrow = el.animate(
      {
        "--button-ripple-r": [`${startRadius}px`, `${endRadius}px`],
        "--button-ripple-x": [`${cx}px`, `${width / 2}px`],
        "--button-ripple-y": [`${cy}px`, `${height / 2}px`]
      },
      {
        pseudoElement: "::after",
        duration: RIPPLE_GROW_MS,
        // m3-ripple grows linearly (no easing default); a fast-start curve
        // covers the button before the 75ms fade-in makes it visible and
        // the ripple reads as a uniform blink.
        easing: "linear",
        fill: "forwards"
      }
    )
    rippleFade = el.animate(
      { opacity: [0, opacity] },
      {
        pseudoElement: "::after",
        duration: RIPPLE_FADE_IN_MS,
        easing: "ease",
        fill: "forwards"
      }
    )
  }

  const endRipple = (el: HTMLElement): void => {
    if (!rippleHeld) return
    rippleHeld = false
    const fadeOut = (): void => {
      rippleEndTimer = undefined
      // Implicit from-keyframe picks up the held opacity; composite order
      // puts this after the fill'd fade-in, so it wins.
      rippleFade = el.animate(
        { opacity: 0 },
        {
          pseudoElement: "::after",
          duration: RIPPLE_FADE_OUT_MS,
          easing: "ease",
          fill: "forwards"
        }
      )
    }
    const remaining =
      RIPPLE_MIN_PRESS_MS - (performance.now() - rippleStartedAt)
    if (remaining > 0) rippleEndTimer = setTimeout(fadeOut, remaining)
    else fadeOut()
  }

  const onClick = (
    event: MouseEvent & { currentTarget: HTMLElement }
  ): void => {
    // Keyboard activation synthesizes a click with detail 0 — center ripple
    // (begin + end back to back; MIN_PRESS keeps it visible).
    if (event.detail === 0) {
      beginRipple(event.currentTarget)
      endRipple(event.currentTarget)
    }
  }

  const onPointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary) return
    const el = event.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    clearTimeout(rippleTimer)
    if (event.pointerType === "touch") {
      rippleTouch = { x, y }
      rippleTimer = setTimeout(() => {
        rippleTimer = undefined
        if (rippleTouch) beginRipple(el, rippleTouch.x, rippleTouch.y)
      }, RIPPLE_TOUCH_DELAY)
    } else {
      beginRipple(el, x, y)
    }
  }

  const onPointerUp = (event: PointerEvent): void => {
    if (!event.isPrimary) return
    const el = event.currentTarget as HTMLElement
    if (rippleTimer !== undefined && rippleTouch) {
      // Quick tap: the release beat the touch delay — play the full ripple.
      const touch = rippleTouch
      clearTimeout(rippleTimer)
      rippleTimer = undefined
      beginRipple(el, touch.x, touch.y)
    }
    rippleTouch = undefined
    endRipple(el)
  }

  const onPointerLeave = (event: PointerEvent): void => {
    clearTimeout(rippleTimer)
    rippleTimer = undefined
    rippleTouch = undefined
    endRipple(event.currentTarget as HTMLElement)
  }

  const onPointerCancel = (event: PointerEvent): void => {
    clearTimeout(rippleTimer)
    rippleTimer = undefined
    rippleTouch = undefined
    endRipple(event.currentTarget as HTMLElement)
  }

  return {
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel
  }
}
