// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { CloseButtonRoot } from "./close-button"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("CloseButton", () => {
  it("renders a button with the default icon, label, and BEM classes", () => {
    const { container } = render(() => <CloseButtonRoot />)

    const button = container.querySelector(
      '[data-slot="close-button"]'
    ) as HTMLButtonElement
    expect(button.tagName).toBe("BUTTON")
    expect(button.getAttribute("aria-label")).toBe("Close")
    expect(classSet(button.className)).toEqual(
      new Set(["close-button", "close-button--default"])
    )

    const icon = button.querySelector(
      '[data-slot="close-button-icon"]'
    ) as SVGElement
    expect(icon).not.toBeNull()
    expect(icon.getAttribute("aria-hidden")).toBe("true")
    // Upstream stamps aria-label on the aria-hidden icon (an a11y defect); the
    // port drops it (see AGENTS.md).
    expect(icon.hasAttribute("aria-label")).toBe(false)
  })

  it("lets the consumer override the label and icon", () => {
    const { container } = render(() => (
      <CloseButtonRoot aria-label="Dismiss">
        <svg data-testid="custom" />
      </CloseButtonRoot>
    ))

    const button = container.querySelector(
      '[data-slot="close-button"]'
    ) as HTMLButtonElement
    expect(button.getAttribute("aria-label")).toBe("Dismiss")
    expect(container.querySelector('[data-testid="custom"]')).not.toBeNull()
    expect(
      container.querySelector('[data-slot="close-button-icon"]')
    ).toBeNull()
  })

  it("merges consumer classes", () => {
    const { container } = render(() => <CloseButtonRoot class="absolute" />)
    const button = container.querySelector(
      '[data-slot="close-button"]'
    ) as HTMLElement
    expect(button.classList.contains("absolute")).toBe(true)
    expect(button.classList.contains("close-button")).toBe(true)
  })
})
