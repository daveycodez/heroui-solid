// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { TextFieldRoot } from "../textfield/textfield"
import { FieldErrorRoot } from "./field-error"

const bySlot = (root: HTMLElement) =>
  root.querySelector("[data-slot=field-error]") as HTMLElement | null

describe("FieldError", () => {
  it("mounts on an invalid field with data-visible, content, and BEM classes", () => {
    const { container } = render(() => (
      <TextFieldRoot isInvalid>
        <FieldErrorRoot class="extra">Required</FieldErrorRoot>
      </TextFieldRoot>
    ))
    const error = bySlot(container)
    expect(error).not.toBeNull()
    expect(error?.getAttribute("data-visible")).toBe("")
    expect(error?.textContent).toBe("Required")
    expect(classSet(error?.className ?? "")).toEqual(
      new Set(["field-error", "extra"])
    )
  })

  it("does not mount on a valid field without forceMount", () => {
    const { container } = render(() => (
      <TextFieldRoot>
        <FieldErrorRoot>Required</FieldErrorRoot>
      </TextFieldRoot>
    ))
    expect(bySlot(container)).toBeNull()
  })

  it("forceMount stays mounted but without data-visible while valid", () => {
    const { container } = render(() => (
      <TextFieldRoot>
        <FieldErrorRoot forceMount>Required</FieldErrorRoot>
      </TextFieldRoot>
    ))
    const error = bySlot(container)
    expect(error).not.toBeNull()
    expect(error?.hasAttribute("data-visible")).toBe(false)
  })

  it("stamps data-visible once the field is invalid", () => {
    const { container } = render(() => (
      <TextFieldRoot isInvalid>
        <FieldErrorRoot forceMount>Required</FieldErrorRoot>
      </TextFieldRoot>
    ))
    expect(bySlot(container)?.getAttribute("data-visible")).toBe("")
  })

  it("throws when rendered outside a field (pass-through to Kobalte)", () => {
    expect(() =>
      render(() => <FieldErrorRoot>Orphan</FieldErrorRoot>)
    ).toThrow()
  })
})
