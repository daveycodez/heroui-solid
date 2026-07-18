// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { SeparatorRoot } from "./separator"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("Separator", () => {
  it("renders an hr with BEM classes, data-slot, and orientation", () => {
    const { container } = render(() => <SeparatorRoot />)
    const separator = container.querySelector(
      "[data-slot=separator]"
    ) as HTMLElement
    expect(separator.tagName).toBe("HR")
    expect(separator.getAttribute("data-orientation")).toBe("horizontal")
    expect(classSet(separator.className)).toEqual(
      new Set(["separator", "separator--horizontal", "separator--default"])
    )
  })

  it("supports vertical orientation and variants", () => {
    const { container } = render(() => (
      <SeparatorRoot orientation="vertical" variant="secondary" />
    ))
    const separator = container.querySelector(
      "[data-slot=separator]"
    ) as HTMLElement
    expect(separator.getAttribute("data-orientation")).toBe("vertical")
    expect(separator.getAttribute("aria-orientation")).toBe("vertical")
    expect(classSet(separator.className)).toEqual(
      new Set(["separator", "separator--vertical", "separator--secondary"])
    )
  })

  it("supports polymorphic as with separator role", () => {
    const { container } = render(() => <SeparatorRoot as="div" />)
    const separator = container.querySelector(
      "[data-slot=separator]"
    ) as HTMLElement
    expect(separator.tagName).toBe("DIV")
    expect(separator.getAttribute("role")).toBe("separator")
  })
})
