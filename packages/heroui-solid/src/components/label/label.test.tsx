// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { LabelRoot } from "./label"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("Label", () => {
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
})
