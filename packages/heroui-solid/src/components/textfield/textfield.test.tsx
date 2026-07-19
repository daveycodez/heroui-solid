// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { InputRoot } from "../input/input"
import { TextAreaRoot } from "../textarea/textarea"
import { TextFieldRoot } from "./textfield"

// TextField is a thin skin over Kobalte's TextField — value control, form-control
// wiring, and accessibility are Kobalte's and aren't retested here. These cover
// only what we add on top: the root data-slot/class and fullWidth variant, the
// explicit data-*="true" re-stamps HeroUI CSS keys off of, and the `variant`
// that cascades to a child Input/TextArea via context.

const root = (c: HTMLElement) =>
  c.querySelector("[data-slot=textfield]") as HTMLElement

describe("TextField (thin skin)", () => {
  it("renders the root with the textfield class and merges a custom class", () => {
    const { container } = render(() => <TextFieldRoot class="extra" />)
    expect(classSet(root(container).className)).toEqual(
      new Set(["textfield", "extra"])
    )
  })

  it("applies the fullWidth variant", () => {
    const { container } = render(() => <TextFieldRoot fullWidth />)
    expect(root(container).classList.contains("textfield--full-width")).toBe(
      true
    )
  })

  it("re-stamps explicit data-*='true' from Kobalte's state props", () => {
    const { container } = render(() => (
      <TextFieldRoot disabled readOnly required validationState="invalid" />
    ))
    const el = root(container)
    expect(el.getAttribute("data-invalid")).toBe("true")
    expect(el.getAttribute("data-required")).toBe("true")
    expect(el.getAttribute("data-disabled")).toBe("true")
    expect(el.getAttribute("data-readonly")).toBe("true")
  })

  it("leaves the re-stamps off in the default state", () => {
    const { container } = render(() => <TextFieldRoot />)
    const el = root(container)
    expect(el.getAttribute("data-invalid")).toBeNull()
    expect(el.getAttribute("data-required")).toBeNull()
    expect(el.getAttribute("data-disabled")).toBeNull()
    expect(el.getAttribute("data-readonly")).toBeNull()
  })

  it("cascades variant to a child Input via context", () => {
    const { getByRole } = render(() => (
      <TextFieldRoot variant="secondary">
        <InputRoot />
      </TextFieldRoot>
    ))
    expect(getByRole("textbox").classList.contains("input--secondary")).toBe(
      true
    )
  })

  it("cascades variant to a child TextArea via context", () => {
    const { getByRole } = render(() => (
      <TextFieldRoot variant="secondary">
        <TextAreaRoot />
      </TextFieldRoot>
    ))
    expect(getByRole("textbox").classList.contains("textarea--secondary")).toBe(
      true
    )
  })
})
