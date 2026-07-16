// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { DescriptionRoot } from "./description"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

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
})
