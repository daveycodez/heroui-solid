// @vitest-environment jsdom
import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { OverlayTriggerContext } from "../../utils/overlay-trigger-context"
import { CloseButtonRoot } from "./close-button"

// Press/focus/disabled are Kobalte's Button. These guard only the thin skin we
// own: the default icon + aria-label, the icon/label overrides, class merging,
// and the OverlayTriggerContext dismiss it triggers on click.

describe("CloseButton (thin skin)", () => {
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
    // Decorative: aria-hidden keeps the shared icon (and its default label) out
    // of the a11y tree; the button owns the accessible name (see AGENTS.md).
    expect(icon.getAttribute("aria-hidden")).toBe("true")
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

  it("closes the enclosing overlay on click", () => {
    const close = vi.fn()
    const { container } = render(() => (
      <OverlayTriggerContext.Provider value={{ close }}>
        <CloseButtonRoot />
      </OverlayTriggerContext.Provider>
    ))
    fireEvent.click(
      container.querySelector('[data-slot="close-button"]') as HTMLElement
    )
    expect(close).toHaveBeenCalledTimes(1)
  })

  it("lets a consumer onClick preventDefault to keep the overlay open", () => {
    const close = vi.fn()
    const { container } = render(() => (
      <OverlayTriggerContext.Provider value={{ close }}>
        <CloseButtonRoot onClick={(event) => event.preventDefault()} />
      </OverlayTriggerContext.Provider>
    ))
    fireEvent.click(
      container.querySelector('[data-slot="close-button"]') as HTMLElement
    )
    expect(close).not.toHaveBeenCalled()
  })
})
