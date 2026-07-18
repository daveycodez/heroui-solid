// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { TextFieldRoot } from "../textfield/textfield"
import { FieldErrorRoot } from "./field-error"

describe("FieldError", () => {
  it("renders nothing outside a field", () => {
    const { container } = render(() => (
      <FieldErrorRoot>Something went wrong.</FieldErrorRoot>
    ))
    expect(container.querySelector("[data-slot=field-error]")).toBeNull()
  })

  it("forceMount renders hidden while valid", () => {
    const { container } = render(() => (
      <TextFieldRoot>
        <FieldErrorRoot forceMount>Something went wrong.</FieldErrorRoot>
      </TextFieldRoot>
    ))
    const error = container.querySelector("[data-slot=field-error]")
    expect(error).not.toBeNull()
    expect(error?.hasAttribute("data-visible")).toBe(false)
  })

  it("forceMount becomes visible when the field is invalid", () => {
    const { container } = render(() => (
      <TextFieldRoot isInvalid>
        <FieldErrorRoot forceMount>Something went wrong.</FieldErrorRoot>
      </TextFieldRoot>
    ))
    const error = container.querySelector("[data-slot=field-error]")
    expect(error?.hasAttribute("data-visible")).toBe(true)
  })
})
