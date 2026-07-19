// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { ScrollShadowRoot } from "./scroll-shadow"

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
