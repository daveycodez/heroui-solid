// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { createRoot } from "solid-js"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { ScrollShadowRoot } from "./scroll-shadow"
import {
  createScrollShadow,
  type UseScrollShadowProps
} from "./use-scroll-shadow"

describe("ScrollShadow", () => {
  it("renders a div with BEM classes, data-slot, orientation, and size", () => {
    const { container } = render(() => (
      <ScrollShadowRoot>content</ScrollShadowRoot>
    ))
    const el = container.querySelector(
      "[data-slot=scroll-shadow]"
    ) as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.getAttribute("data-orientation")).toBe("vertical")
    expect(el.getAttribute("data-scroll-shadow-size")).toBe("40")
    expect(el.style.getPropertyValue("--scroll-shadow-size")).toBe("40px")
    expect(classSet(el.className)).toEqual(
      new Set([
        "scroll-shadow",
        "scroll-shadow--fade",
        "scroll-shadow--vertical"
      ])
    )
  })

  it("supports horizontal orientation and hidden scrollbar", () => {
    const { container } = render(() => (
      <ScrollShadowRoot hideScrollBar orientation="horizontal">
        content
      </ScrollShadowRoot>
    ))
    const el = container.querySelector(
      "[data-slot=scroll-shadow]"
    ) as HTMLElement
    expect(el.getAttribute("data-orientation")).toBe("horizontal")
    expect(classSet(el.className)).toEqual(
      new Set([
        "scroll-shadow",
        "scroll-shadow--fade",
        "scroll-shadow--horizontal",
        "scroll-shadow--hide-scrollbar"
      ])
    )
  })

  it("applies a custom size to the css variable and data attribute", () => {
    const { container } = render(() => <ScrollShadowRoot size={80} />)
    const el = container.querySelector(
      "[data-slot=scroll-shadow]"
    ) as HTMLElement
    expect(el.getAttribute("data-scroll-shadow-size")).toBe("80")
    expect(el.style.getPropertyValue("--scroll-shadow-size")).toBe("80px")
  })

  it("mirrors controlled visibility onto the dataset", () => {
    const { container } = render(() => (
      <ScrollShadowRoot visibility="both">content</ScrollShadowRoot>
    ))
    const el = container.querySelector(
      "[data-slot=scroll-shadow]"
    ) as HTMLElement
    expect(el.dataset.topBottomScroll).toBe("true")
  })

  it("merges a forwarded class", () => {
    const { container } = render(() => <ScrollShadowRoot class="custom" />)
    const el = container.querySelector(
      "[data-slot=scroll-shadow]"
    ) as HTMLElement
    expect(el.classList.contains("custom")).toBe(true)
  })
})

// The initialShadow seed (SSR / first frame) can't be observed through a
// client render(): on mount the auto-detection effect measures zero-size
// jsdom nodes and clears it. Read the hook directly with no container, so
// the measurement effect early-returns and the seed stays put.
describe("createScrollShadow initialShadow seed", () => {
  const seed = (over: Partial<UseScrollShadowProps>) =>
    createRoot((dispose) => {
      const attrs = createScrollShadow({
        assumeOverflow: () => false,
        containerRef: () => undefined,
        isEnabled: () => true,
        offset: () => 0,
        orientation: () => "vertical",
        visibility: () => "auto",
        ...over
      })
      const result = attrs()
      dispose()
      return result
    })

  it("seeds the far-edge shadow when overflow is assumed (vertical)", () => {
    expect(seed({ assumeOverflow: () => true })).toEqual({
      "data-bottom-scroll": "true"
    })
  })

  it("seeds the far-edge shadow when overflow is assumed (horizontal)", () => {
    expect(
      seed({ assumeOverflow: () => true, orientation: () => "horizontal" })
    ).toEqual({ "data-right-scroll": "true" })
  })

  it("seeds nothing by default", () => {
    expect(seed({})).toEqual({})
  })

  it("seeds nothing when disabled, even if overflow is assumed", () => {
    expect(
      seed({ assumeOverflow: () => true, isEnabled: () => false })
    ).toEqual({})
  })
})
