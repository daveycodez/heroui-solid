// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { CloseButtonRoot } from "./close-button"

// CloseButton is a thin skin over Kobalte's Button. These guard only what we own:
// the BEM class, the default decorative icon, aria-label, form-safe type, class
// merging, and prop pass-through.

describe("CloseButton (thin skin)", () => {
  it("renders a labeled button with the default close icon", () => {
    const { getByRole, container } = render(() => <CloseButtonRoot />)
    const button = getByRole("button") as HTMLButtonElement

    expect(button.getAttribute("data-slot")).toBe("close-button")
    expect(button.getAttribute("aria-label")).toBe("Close")
    expect(button.getAttribute("type")).toBe("button")
    expect(classSet(button.className)).toEqual(
      new Set(["close-button", "close-button--default"])
    )

    const icon = container.querySelector(
      '[data-slot="close-button-icon"]'
    ) as SVGElement
    expect(icon.tagName.toLowerCase()).toBe("svg")
    // Decorative — the button already carries the accessible name.
    expect(icon.getAttribute("aria-hidden")).toBe("true")
  })

  it("renders custom children instead of the default icon", () => {
    const { container } = render(() => (
      <CloseButtonRoot>
        <span data-testid="custom">x</span>
      </CloseButtonRoot>
    ))
    expect(container.querySelector('[data-testid="custom"]')).toBeTruthy()
    expect(
      container.querySelector('[data-slot="close-button-icon"]')
    ).toBeNull()
  })

  it("merges a custom class and forwards props", () => {
    let clicked = false
    const { getByRole } = render(() => (
      <CloseButtonRoot
        aria-label="Dismiss"
        class="custom"
        onClick={() => (clicked = true)}
      />
    ))
    const button = getByRole("button") as HTMLButtonElement
    expect(button.getAttribute("aria-label")).toBe("Dismiss")
    expect(classSet(button.className)).toEqual(
      new Set(["close-button", "close-button--default", "custom"])
    )

    fireEvent.click(button)
    expect(clicked).toBe(true)
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => <CloseButtonRoot as="a" href="#" />)
    const el = container.querySelector(
      '[data-slot="close-button"]'
    ) as HTMLElement
    expect(el.tagName).toBe("A")
  })
})
