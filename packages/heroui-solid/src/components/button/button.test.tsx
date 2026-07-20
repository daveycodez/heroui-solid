// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { ButtonRoot } from "./button"

// Button is a thin skin over Kobalte's Button. These guard only what we own:
// the variant/BEM classes, class merging, the polymorphic class-passthrough,
// and the HeroUI `isPending` add-on (aria-live, state-derived data attrs, the
// activation guard). Native button behavior, `disabled`, focus, and keyboard
// activation are Kobalte's domain — not tested here.

describe("Button (thin skin)", () => {
  it("renders a native button with BEM classes, data-slot and caller class last", () => {
    const { getByRole } = render(() => (
      <ButtonRoot variant="ghost" size="lg" class="custom">
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.tagName).toBe("BUTTON")
    expect(button.getAttribute("data-slot")).toBe("button")
    expect(classSet(button.className)).toEqual(
      new Set(["button", "button--ghost", "button--lg", "custom"])
    )
  })

  it("rides the composed classes onto a polymorphic element via as", () => {
    const { getByText } = render(() => (
      <ButtonRoot as="a" href="https://example.com">
        Link
      </ButtonRoot>
    ))
    const link = getByText("Link")
    expect(link.tagName).toBe("A")
    expect(classSet(link.className)).toEqual(
      new Set(["button", "button--primary", "button--md"])
    )
  })

  it("stamps pending state and swallows activation while pending", () => {
    const onClick = vi.fn()
    const native = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot isPending onClick={onClick}>
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.getAttribute("data-pending")).toBe("true")
    expect(button.getAttribute("aria-disabled")).toBe("true")
    // Added after mount — only stopImmediatePropagation from our earlier
    // at-target listener can silence it. Enter/Space synthesize this same
    // native click, so this covers keyboard activation too.
    button.addEventListener("click", native)
    button.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    )
    expect(onClick).not.toHaveBeenCalled()
    expect(native).not.toHaveBeenCalled()
  })

  it("invokes onClick and native listeners when not pending", () => {
    const onClick = vi.fn()
    const native = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot onClick={onClick}>Hi</ButtonRoot>
    ))
    const button = getByRole("button")
    button.addEventListener("click", native)
    button.click()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(native).toHaveBeenCalledTimes(1)
  })

  it("stamps a polite live region only when the consumer uses pending", () => {
    const withPending = render(() => (
      <ButtonRoot isPending={false}>Hi</ButtonRoot>
    ))
    expect(withPending.getByRole("button").getAttribute("aria-live")).toBe(
      "polite"
    )
    const withoutPending = render(() => <ButtonRoot>Hi</ButtonRoot>)
    expect(
      withoutPending.getByRole("button").getAttribute("aria-live")
    ).toBeNull()
  })

  it("prevents consumers from desyncing state-derived attributes while pending", () => {
    const { getByRole } = render(() => (
      <ButtonRoot isPending aria-disabled="false" data-pending="false">
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.getAttribute("data-pending")).toBe("true")
    expect(button.getAttribute("aria-disabled")).toBe("true")
  })
})
