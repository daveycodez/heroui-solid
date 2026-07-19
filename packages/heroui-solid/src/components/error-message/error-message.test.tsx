// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { ErrorMessageRoot } from "./error-message"

// ErrorMessage is a presentational Polymorphic span; there is no Kobalte
// behavior to retest. These guard only our thin skin: the slot class, the
// data-slot/slot hooks, class merging, and the polymorphic `as`.

describe("ErrorMessage (thin skin)", () => {
  it("renders a span with the slot class, data-slot and errorMessage slot", () => {
    const { container } = render(() => (
      <ErrorMessageRoot class="custom">Required</ErrorMessageRoot>
    ))
    const el = container.querySelector(
      "[data-slot=error-message]"
    ) as HTMLElement
    expect(el.tagName).toBe("SPAN")
    expect(el.getAttribute("slot")).toBe("errorMessage")
    expect(classSet(el.className)).toEqual(new Set(["error-message", "custom"]))
    expect(el.textContent).toBe("Required")
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => (
      <ErrorMessageRoot as="div">Oops</ErrorMessageRoot>
    ))
    const el = container.querySelector(
      "[data-slot=error-message]"
    ) as HTMLElement
    expect(el.tagName).toBe("DIV")
    expect(el.getAttribute("slot")).toBe("errorMessage")
  })
})
