import { type ButtonVariants, buttonVariants, cn } from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import { Trigger as MenuTriggerPrimitive } from "@kobalte/core/dropdown-menu"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import {
  createMemo,
  type JSX,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import {
  createLongPressHandlers,
  MenuTriggerBehaviorContext,
  MenuTriggerContext
} from "../../utils/menu-trigger-context"
import { OverlayTriggerContext } from "../../utils/overlay-trigger-context"
import { ButtonGroupContext } from "../button-group"

// Material 3 ripple timings, after m3-ripple: how long a touch must hold (or
// how fast it must lift) before it counts as a press rather than a scroll;
// press-point → grown-and-centered growth; fade-in on press and fade-out on
// release, held for at least MIN_PRESS so fast clicks still read as a full
// ripple.
const RIPPLE_TOUCH_DELAY = 150
const RIPPLE_GROW_MS = 150
const RIPPLE_FADE_IN_MS = 75
const RIPPLE_FADE_OUT_MS = 375
const RIPPLE_MIN_PRESS_MS = 225

interface ButtonRootProps extends ButtonVariants {
  isDisabled?: boolean
  isPending?: boolean
  class?: string
  /** Read `state` fields inside JSX — destructuring loses reactivity. */
  children?: JSX.Element | ((state: { isPending: boolean }) => JSX.Element)
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
}

const ButtonRoot = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as ButtonRootProps,
    buttonVariants.variantKeys,
    ["isDisabled", "isPending", "class", "children", "onClick"]
  )

  // As the Dropdown trigger slot with trigger="longPress", the button hosts
  // the long-press interactions (see utils/menu-trigger-context.tsx).
  const isMenuTrigger = useContext(MenuTriggerContext)
  const longPress = createLongPressHandlers(
    isMenuTrigger ? useContext(MenuTriggerBehaviorContext) : undefined
  )

  // As an AlertDialog trigger (or a `slot="close"` action button) the button
  // drives the enclosing dialog — see utils/overlay-trigger-context.tsx.
  const overlay = useContext(OverlayTriggerContext)

  // Direct props win over the enclosing ButtonGroup's shared values; outside a
  // group the context default is empty, so these fall back to the local props.
  const group = useContext(ButtonGroupContext)
  const groupVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? group.variant
    },
    get size() {
      return variantProps.size ?? group.size
    },
    get fullWidth() {
      return variantProps.fullWidth ?? group.fullWidth
    }
  })

  // At-target `on:click` registers ahead of consumer listeners, so
  // stopImmediatePropagation silences them all while pending/disabled
  // (covers polymorphic elements with no native `disabled`); keyboard
  // activation synthesizes a click and hits the same guard.
  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    longPress.onClick(event)
    if (event.defaultPrevented) {
      return
    }
    if (local.isPending || (local.isDisabled ?? group.isDisabled)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    // Keyboard activation synthesizes a click with detail 0 — center ripple
    // (begin + end back to back; MIN_PRESS keeps it visible).
    if (event.detail === 0) {
      beginRipple(event.currentTarget)
      endRipple(event.currentTarget)
    }
    callHandler(event, local.onClick)
    if (event.defaultPrevented) {
      return
    }
    // A `slot="close"` button closes the enclosing dialog; any other button in
    // the trigger region opens it (both no-op outside an AlertDialog).
    if ((props as { slot?: string }).slot === "close") {
      overlay.close?.()
    } else {
      overlay.open?.()
    }
  }

  // Ripple (opt-in via the inherited --button-ripple flag — see
  // button.overrides.css). Material 3 press lifecycle, after m3-ripple:
  // beginRipple grows the ripple from the press point toward the center
  // (fill: forwards keeps it while held) and fades it in; endRipple fades it
  // out on release, no sooner than MIN_PRESS after the grow started. Touch
  // arms a short delay so a press that becomes a scroll (pointercancel)
  // never ripples, while both a quick tap (release beats the delay) and a
  // sustained hold do. Keyboard activation ripples from the center via the
  // synthesized click (detail 0). Cosmetic, client-only, no-ops when off.
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

  const handlePointerDown = (event: PointerEvent): void => {
    longPress.onPointerDown(event)
    if (
      !event.isPrimary ||
      local.isPending ||
      (local.isDisabled ?? group.isDisabled)
    )
      return
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

  const handlePointerUp = (event: PointerEvent): void => {
    longPress.onPointerUp()
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

  const handlePointerLeave = (event: PointerEvent): void => {
    longPress.onPointerLeave()
    clearTimeout(rippleTimer)
    rippleTimer = undefined
    rippleTouch = undefined
    endRipple(event.currentTarget as HTMLElement)
  }

  const handlePointerCancel = (event: PointerEvent): void => {
    longPress.onPointerCancel()
    clearTimeout(rippleTimer)
    rippleTimer = undefined
    rippleTouch = undefined
    endRipple(event.currentTarget as HTMLElement)
  }

  // isPending stays live through the getter.
  const state = {
    get isPending() {
      return !!local.isPending
    }
  }

  // Resolve children exactly once (single-read hydration rule — AGENTS.md);
  // the memo tracks only `children`, so isPending toggles never re-invoke
  // the render prop.
  const resolved = createMemo(() => {
    const children = local.children
    return typeof children === "function" ? children(state) : children
  })

  const forwarded = mergeProps(rest, {
    get children(): JSX.Element {
      return resolved()
    }
  })

  // Inside a Dropdown's trigger slot the same button renders Kobalte's menu
  // trigger (see utils/menu-trigger-context.tsx) — upstream parity for
  // <Dropdown><Button>…</Button>….
  const Primitive = isMenuTrigger ? MenuTriggerPrimitive : ButtonPrimitive

  return (
    <Primitive
      class={cn(buttonVariants(groupVariants), local.class)}
      data-slot="button"
      // Announces render-prop label changes while pending (React Aria's
      // pending pattern); only stamped when the consumer opts in.
      aria-live={"isPending" in local ? "polite" : undefined}
      on:click={handleClick}
      on:pointerdown={handlePointerDown}
      on:pointerup={handlePointerUp}
      on:pointerleave={handlePointerLeave}
      on:pointercancel={handlePointerCancel}
      on:keydown={longPress.onKeyDown}
      on:contextmenu={longPress.onContextMenu}
      {...forwarded}
      // After the spread so consumers can't desync state-derived attributes;
      // mergeProps skips undefined, so consumer values apply while off.
      disabled={local.isDisabled ?? group.isDisabled}
      data-pending={local.isPending ? "true" : undefined}
      aria-disabled={local.isPending ? "true" : undefined}
    />
  )
}

export type { ButtonRootProps }
export { ButtonRoot }
