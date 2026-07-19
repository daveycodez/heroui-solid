// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { DescriptionRoot } from "./description"

describe("Description", () => {
  it("renders a plain element with BEM classes outside a field", () => {
    const { getByText } = render(() => (
      <DescriptionRoot class="custom">Helper text</DescriptionRoot>
    ))
    const description = getByText("Helper text") as HTMLElement
    expect(description.getAttribute("data-slot")).toBe("description")
    expect(classSet(description.className)).toEqual(
      new Set(["description", "custom"])
    )
  })

  it("is polymorphic via as", () => {
    const { getByText } = render(() => (
      <DescriptionRoot as="p">Helper text</DescriptionRoot>
    ))
    expect((getByText("Helper text") as HTMLElement).tagName).toBe("P")
  })
})
