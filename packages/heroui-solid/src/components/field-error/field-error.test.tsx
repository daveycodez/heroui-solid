// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { FieldErrorRoot } from "./field-error"

describe("FieldError", () => {
  it("renders nothing outside a field", () => {
    const { container } = render(() => (
      <FieldErrorRoot>Something went wrong.</FieldErrorRoot>
    ))
    expect(container.querySelector("[data-slot=field-error]")).toBeNull()
  })
})
