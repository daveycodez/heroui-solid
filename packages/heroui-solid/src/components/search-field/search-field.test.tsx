// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import {
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
} from "./search-field"

// Value flow / field wiring are Kobalte's TextField; these guard the thin skin
// we own: slot classes, data-slots, type="search", the search behaviors
// (clear button, Escape-to-clear), data-empty, and the state mirroring.

const anatomy = (props = {}) => (
  <SearchFieldRoot {...props}>
    <SearchFieldGroup>
      <SearchFieldSearchIcon />
      <SearchFieldInput />
      <SearchFieldClearButton />
    </SearchFieldGroup>
  </SearchFieldRoot>
)

const q = (root: HTMLElement, slot: string) =>
  root.querySelector(`[data-slot="${slot}"]`) as HTMLElement

describe("SearchField (thin skin)", () => {
  it("renders the anatomy with BEM classes, data-slots, and type=search", () => {
    const { container } = render(() => anatomy())

    const root = q(container, "search-field")
    expect(classSet(root.className)).toEqual(
      new Set(["search-field", "search-field--primary"])
    )

    expect(classSet(q(container, "search-field-group").className)).toEqual(
      new Set(["search-field__group"])
    )

    const input = q(container, "search-field-input") as HTMLInputElement
    expect(input.tagName).toBe("INPUT")
    expect(input.type).toBe("search")
    expect(classSet(input.className)).toEqual(new Set(["search-field__input"]))

    const icon = q(container, "search-field-search-icon")
    expect(icon.getAttribute("aria-hidden")).toBe("true")
    expect(icon.querySelector("svg")).toBeTruthy()

    const clear = q(container, "search-field-clear-button")
    expect(clear.getAttribute("slot")).toBe("clear")
    // Rides on CloseButton — its icon slot survives for the size override.
    expect(clear.querySelector('[data-slot="close-button-icon"]')).toBeTruthy()
  })

  it("applies variant and fullWidth modifiers on the root", () => {
    const { container } = render(() =>
      anatomy({ fullWidth: true, variant: "secondary" })
    )
    expect(classSet(q(container, "search-field").className)).toEqual(
      new Set([
        "search-field",
        "search-field--secondary",
        "search-field--full-width"
      ])
    )
  })

  it("marks the root empty and drops it once there is a value", () => {
    const { container } = render(() => anatomy())
    const root = q(container, "search-field")
    const input = q(container, "search-field-input") as HTMLInputElement

    expect(root.getAttribute("data-empty")).toBe("true")

    fireEvent.input(input, { target: { value: "shoes" } })
    expect(input.value).toBe("shoes")
    expect(root.hasAttribute("data-empty")).toBe(false)
  })

  it("clears the value and refocuses the input via the clear button", () => {
    const { container } = render(() => anatomy({ defaultValue: "hello" }))
    const input = q(container, "search-field-input") as HTMLInputElement
    const clear = q(container, "search-field-clear-button")

    expect(input.value).toBe("hello")
    fireEvent.click(clear)
    expect(input.value).toBe("")
    expect(document.activeElement).toBe(input)
  })

  it("clears a non-empty field on Escape", () => {
    const { container } = render(() => anatomy({ defaultValue: "query" }))
    const input = q(container, "search-field-input") as HTMLInputElement

    fireEvent.keyDown(input, { key: "Escape" })
    expect(input.value).toBe("")
  })

  it("mirrors the invalid state onto the group", () => {
    const { container } = render(() => anatomy({ validationState: "invalid" }))
    expect(
      q(container, "search-field-group").getAttribute("data-invalid")
    ).toBe("true")
  })

  it("calls onClear when cleared", () => {
    let cleared = false
    const { container } = render(() =>
      anatomy({ defaultValue: "x", onClear: () => (cleared = true) })
    )
    fireEvent.click(q(container, "search-field-clear-button"))
    expect(cleared).toBe(true)
  })
})
