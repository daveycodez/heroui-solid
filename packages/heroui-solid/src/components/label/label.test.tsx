// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { LabelRoot } from "./label"

// The in-field render (Kobalte Label) is covered via the TextField anatomy. These
// guard only the thin skin we own: the standalone fallback branch, slot class,
// data-slot, the state variant modifiers, class merging, and the polymorphic `as`.

describe("Label (thin skin)", () => {
  it("renders a plain label with BEM classes outside a field", () => {
    const { getByText } = render(() => (
      <LabelRoot class="custom" for="email">
        Email
      </LabelRoot>
    ))
    const label = getByText("Email") as HTMLLabelElement
    expect(label.tagName).toBe("LABEL")
    expect(label.getAttribute("data-slot")).toBe("label")
    expect(label.htmlFor).toBe("email")
    expect(classSet(label.className)).toEqual(new Set(["label", "custom"]))
  })

  it("applies state modifiers from props", () => {
    const { getByText } = render(() => (
      <LabelRoot isDisabled isInvalid isRequired>
        Email
      </LabelRoot>
    ))
    expect(classSet((getByText("Email") as HTMLElement).className)).toEqual(
      new Set(["label", "label--required", "label--disabled", "label--invalid"])
    )
  })

  it("is polymorphic via as (label styling on another element)", () => {
    const { getByText } = render(() => <LabelRoot as="span">Email</LabelRoot>)
    expect((getByText("Email") as HTMLElement).tagName).toBe("SPAN")
  })
})
