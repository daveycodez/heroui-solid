// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { InputRoot } from "./input"

// Value flow and field wiring are Kobalte's (via FormControlContext). These guard
// only the thin skin we own: the standalone fallback branch, slot class,
// data-slot, and the variant/fullWidth modifiers.

describe("Input (thin skin)", () => {
  it("renders a plain input with BEM classes outside a field", () => {
    const { getByRole } = render(() => (
      <InputRoot class="custom" placeholder="Type here" />
    ))
    const input = getByRole("textbox") as HTMLInputElement
    expect(input.getAttribute("data-slot")).toBe("input")
    expect(input.placeholder).toBe("Type here")
    expect(classSet(input.className)).toEqual(
      new Set(["input", "input--primary", "custom"])
    )
  })

  it("applies variant and fullWidth modifiers", () => {
    const { getByRole } = render(() => (
      <InputRoot fullWidth variant="secondary" />
    ))
    expect(
      classSet((getByRole("textbox") as HTMLInputElement).className)
    ).toEqual(new Set(["input", "input--secondary", "input--full-width"]))
  })
})
