// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { TextAreaRoot } from "./textarea"

describe("TextArea", () => {
  it("renders a plain textarea with BEM classes outside a field", () => {
    const { getByRole } = render(() => <TextAreaRoot class="custom" />)
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea.getAttribute("data-slot")).toBe("textarea")
    expect(classSet(textarea.className)).toEqual(
      new Set(["textarea", "textarea--primary", "custom"])
    )
  })

  it("applies variant and fullWidth modifiers", () => {
    const { getByRole } = render(() => (
      <TextAreaRoot fullWidth variant="secondary" />
    ))
    expect(
      classSet((getByRole("textbox") as HTMLTextAreaElement).className)
    ).toEqual(
      new Set(["textarea", "textarea--secondary", "textarea--full-width"])
    )
  })
})
