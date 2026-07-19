// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { SeparatorRoot } from "./separator"

// Orientation, role, aria and polymorphic `as` are Kobalte's Separator and are
// not retested here. These guard only the thin skin we own: slot class,
// data-slot hook, and the orientation/variant modifiers.

describe("Separator (thin skin)", () => {
  it("renders an hr with BEM classes and data-slot", () => {
    const { container } = render(() => <SeparatorRoot />)
    const separator = container.querySelector(
      "[data-slot=separator]"
    ) as HTMLElement
    expect(separator.tagName).toBe("HR")
    expect(classSet(separator.className)).toEqual(
      new Set(["separator", "separator--horizontal", "separator--default"])
    )
  })

  it("applies vertical orientation and variant modifiers", () => {
    const { container } = render(() => (
      <SeparatorRoot orientation="vertical" variant="secondary" />
    ))
    const separator = container.querySelector(
      "[data-slot=separator]"
    ) as HTMLElement
    expect(classSet(separator.className)).toEqual(
      new Set(["separator", "separator--vertical", "separator--secondary"])
    )
  })
})
