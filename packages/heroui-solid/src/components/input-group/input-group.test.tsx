// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { ButtonRoot } from "../button/button"
import { InputRoot } from "../input/input"
import { TextAreaRoot } from "../textarea/textarea"
import { TextFieldRoot } from "../textfield/textfield"
import {
  InputGroupPrefix,
  InputGroupRoot,
  InputGroupSuffix
} from "./input-group"

// Field wiring, value flow, and validation are Kobalte's (via FormControlContext).
// These guard only the thin skin we own: slot classes, data-slots, the
// variant/fullWidth modifiers, the group's state mirroring, the click-to-focus
// add-on, and the context re-slotting of a standalone Input/TextArea placed in
// the group (there is no InputGroup.Input / InputGroup.TextArea).

describe("InputGroup (thin skin)", () => {
  it("re-slots a standalone Input/Prefix/Suffix placed inside the group", () => {
    const { container } = render(() => (
      <InputGroupRoot>
        <InputGroupPrefix>$</InputGroupPrefix>
        <InputRoot placeholder="0" />
        <InputGroupSuffix>USD</InputGroupSuffix>
      </InputGroupRoot>
    ))

    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    expect(root.getAttribute("role")).toBe("group")
    expect(classSet(root.className)).toEqual(
      new Set(["input-group", "input-group--primary"])
    )

    const prefix = container.querySelector(
      '[data-slot="input-group-prefix"]'
    ) as HTMLElement
    expect(classSet(prefix.className)).toEqual(new Set(["input-group__prefix"]))
    expect(prefix.textContent).toBe("$")

    // The standalone Input adopts the group's input slot + data-slot — NOT its
    // own `.input` base (which would double the border/focus ring).
    const input = container.querySelector(
      '[data-slot="input-group-input"]'
    ) as HTMLInputElement
    expect(input.tagName).toBe("INPUT")
    expect(input.placeholder).toBe("0")
    expect(classSet(input.className)).toEqual(new Set(["input-group__input"]))

    const suffix = container.querySelector(
      '[data-slot="input-group-suffix"]'
    ) as HTMLElement
    expect(classSet(suffix.className)).toEqual(new Set(["input-group__suffix"]))
    expect(suffix.textContent).toBe("USD")
  })

  it("leaves a standalone Input untouched outside a group", () => {
    const { container } = render(() => <InputRoot placeholder="plain" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.getAttribute("data-slot")).toBe("input")
    expect(classSet(input.className)).toEqual(
      new Set(["input", "input--primary"])
    )
  })

  it("re-slots a standalone TextArea inside the group", () => {
    const { container } = render(() => (
      <InputGroupRoot>
        <TextAreaRoot rows={3} />
      </InputGroupRoot>
    ))
    const textarea = container.querySelector(
      '[data-slot="input-group-textarea"]'
    ) as HTMLTextAreaElement
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea.rows).toBe(3)
    expect(classSet(textarea.className)).toEqual(
      new Set(["input-group__input"])
    )
  })

  it("applies variant and fullWidth modifiers on the root", () => {
    const { container } = render(() => (
      <InputGroupRoot fullWidth variant="secondary">
        <InputRoot />
      </InputGroupRoot>
    ))
    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set([
        "input-group",
        "input-group--secondary",
        "input-group--full-width"
      ])
    )
  })

  it("inherits the variant from a parent TextField", () => {
    const { container } = render(() => (
      <TextFieldRoot variant="secondary">
        <InputGroupRoot>
          <InputRoot />
        </InputGroupRoot>
      </TextFieldRoot>
    ))
    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    expect(root.classList.contains("input-group--secondary")).toBe(true)
  })

  it("wires the input to the field and mirrors invalid state onto the group", () => {
    const { container } = render(() => (
      <TextFieldRoot validationState="invalid">
        <InputGroupRoot>
          <InputRoot />
        </InputGroupRoot>
      </TextFieldRoot>
    ))
    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    expect(root.getAttribute("data-invalid")).toBe("true")

    // Kobalte's Input carries the field id/aria wiring when in a field.
    const input = container.querySelector(
      '[data-slot="input-group-input"]'
    ) as HTMLInputElement
    expect(input.getAttribute("aria-invalid")).toBe("true")
  })

  it("mirrors the disabled state onto the group", () => {
    const { container } = render(() => (
      <TextFieldRoot disabled>
        <InputGroupRoot>
          <InputRoot />
        </InputGroupRoot>
      </TextFieldRoot>
    ))
    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    expect(root.getAttribute("data-disabled")).toBe("true")
  })

  it("leaves state attributes absent when standalone", () => {
    const { container } = render(() => (
      <InputGroupRoot>
        <InputRoot />
      </InputGroupRoot>
    ))
    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    expect(root.hasAttribute("data-invalid")).toBe(false)
    expect(root.hasAttribute("data-disabled")).toBe(false)
  })

  it("focuses the input when the group is clicked outside the field", () => {
    const { container } = render(() => (
      <InputGroupRoot>
        <InputGroupPrefix>$</InputGroupPrefix>
        <InputRoot />
      </InputGroupRoot>
    ))
    const input = container.querySelector(
      '[data-slot="input-group-input"]'
    ) as HTMLInputElement
    const prefix = container.querySelector(
      '[data-slot="input-group-prefix"]'
    ) as HTMLElement

    expect(document.activeElement).not.toBe(input)
    fireEvent.click(prefix)
    expect(document.activeElement).toBe(input)
  })

  it("does not steal focus when a suffix button is clicked", () => {
    const { container, getByRole } = render(() => (
      <InputGroupRoot>
        <InputRoot />
        <InputGroupSuffix>
          <ButtonRoot aria-label="Toggle">x</ButtonRoot>
        </InputGroupSuffix>
      </InputGroupRoot>
    ))
    const input = container.querySelector(
      '[data-slot="input-group-input"]'
    ) as HTMLInputElement
    const button = getByRole("button")

    fireEvent.click(button)
    expect(document.activeElement).not.toBe(input)
  })

  it("forwards the onClick handler", () => {
    let clicked = false
    const { container } = render(() => (
      <InputGroupRoot onClick={() => (clicked = true)}>
        <InputRoot />
      </InputGroupRoot>
    ))
    const root = container.querySelector(
      '[data-slot="input-group"]'
    ) as HTMLElement
    fireEvent.click(root)
    expect(clicked).toBe(true)
  })
})
