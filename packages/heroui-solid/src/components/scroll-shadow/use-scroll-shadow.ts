import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js"

import type { ScrollShadowVisibility } from "./scroll-shadow"

export interface UseScrollShadowProps {
  containerRef: Accessor<HTMLElement | undefined>
  orientation: Accessor<"vertical" | "horizontal">
  offset: Accessor<number>
  visibility: Accessor<ScrollShadowVisibility>
  isEnabled: Accessor<boolean>
  // Whether to render the end-edge shadow before measurement (SSR / first
  // frame). True when overflow is expected; false avoids a shadow that would
  // vanish on mount when the content doesn't actually overflow.
  assumeOverflow: Accessor<boolean>
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void
}

type ShadowAttrs = Record<string, string>

// The `data-*-scroll` attributes are rendered declaratively (spread onto the
// element) rather than written to `el.dataset`, so the initial state is present
// in the SSR payload — no measurement, no flicker-in after mount.
export function createScrollShadow(
  props: UseScrollShadowProps
): Accessor<ShadowAttrs> {
  const controlledAttrs = (): ShadowAttrs => {
    const vis = props.visibility()
    const vertical = props.orientation() === "vertical"

    if (vis === "none") return {}
    if (vis === "both") {
      return vertical
        ? { "data-top-bottom-scroll": "true" }
        : { "data-left-right-scroll": "true" }
    }
    // "top" | "bottom" | "left" | "right"
    return { [`data-${vis}-scroll`]: "true" }
  }

  // SSR default for auto detection: content starts scrolled to the top/left, so
  // the far edge overflows — a shadow on the bottom (vertical) / right
  // (horizontal). The client measurement corrects this on mount.
  const autoInitial = (): ShadowAttrs => {
    if (!props.isEnabled() || !props.assumeOverflow()) return {}
    return props.orientation() === "vertical"
      ? { "data-bottom-scroll": "true" }
      : { "data-right-scroll": "true" }
  }

  const initial =
    props.visibility() === "auto" ? autoInitial() : controlledAttrs()

  const [attrs, setAttrs] = createSignal<ShadowAttrs>(initial)

  // Controlled visibility mode: mirror the requested state directly.
  createEffect(() => {
    if (props.visibility() !== "auto") {
      setAttrs(controlledAttrs())
    }
  })

  // Auto detection (client only — needs layout). Seed the dedup key from the
  // SSR default so the first measurement can detect a change away from it.
  let prevKey = Object.keys(initial).join()
  let rafId: number | null = null

  const measure = (immediate: boolean) => {
    const el = props.containerRef()

    if (!el || !props.isEnabled() || props.visibility() !== "auto") return

    const vertical = props.orientation() === "vertical"
    const offset = props.offset()
    const scrollStart = vertical ? el.scrollTop : el.scrollLeft
    const scrollSize = vertical ? el.scrollHeight : el.scrollWidth
    const clientSize = vertical ? el.clientHeight : el.clientWidth

    const hasBefore = scrollStart > offset
    const hasAfter = scrollStart + clientSize + offset < scrollSize

    let next: ShadowAttrs = {}
    let visibility: ScrollShadowVisibility = "none"

    if (vertical) {
      if (hasBefore && hasAfter) {
        next = { "data-top-bottom-scroll": "true" }
        visibility = "both"
      } else if (hasBefore) {
        next = { "data-top-scroll": "true" }
        visibility = "top"
      } else if (hasAfter) {
        next = { "data-bottom-scroll": "true" }
        visibility = "bottom"
      }
    } else {
      if (hasBefore && hasAfter) {
        next = { "data-left-right-scroll": "true" }
        visibility = "both"
      } else if (hasBefore) {
        next = { "data-left-scroll": "true" }
        visibility = "left"
      } else if (hasAfter) {
        next = { "data-right-scroll": "true" }
        visibility = "right"
      }
    }

    const key = Object.keys(next).join()
    if (key === prevKey) return
    prevKey = key

    const apply = () => {
      setAttrs(next)
      props.onVisibilityChange?.(visibility)
    }

    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    if (immediate) {
      apply()
      return
    }

    rafId = requestAnimationFrame(() => {
      rafId = null
      apply()
    })
  }

  createEffect(() => {
    const el = props.containerRef()

    if (!el || !props.isEnabled() || props.visibility() !== "auto") return

    // Initial measurement synchronously, before the browser's first paint.
    measure(true)

    const onScroll = () => measure(false)
    el.addEventListener("scroll", onScroll, { passive: true })

    // jsdom has no ResizeObserver; scroll + initial check still exercise the rest
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure(false))
        : null

    resizeObserver?.observe(el)

    onCleanup(() => {
      el.removeEventListener("scroll", onScroll)
      resizeObserver?.disconnect()

      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      prevKey = ""
    })
  })

  return attrs
}
