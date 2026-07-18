// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { ChipLabel, ChipRoot } from "./chip"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("Chip", () => {
  it("wraps plain-text children in a label with default variant/color", () => {
    const { container } = render(() => <ChipRoot>Default</ChipRoot>)

    const root = container.querySelector('[data-slot="chip"]') as HTMLElement
    expect(root.tagName).toBe("SPAN")
    expect(classSet(root.className)).toEqual(
      new Set(["chip", "chip--default", "chip--secondary"])
    )

    const label = container.querySelector(
      '[data-slot="chip-label"]'
    ) as HTMLElement
    expect(label.textContent).toBe("Default")
    expect(classSet(label.className)).toEqual(new Set(["chip__label"]))
  })

  it("applies color, size, and variant modifiers", () => {
    const { container } = render(() => (
      <ChipRoot color="success" size="lg" variant="primary">
        Active
      </ChipRoot>
    ))

    const root = container.querySelector('[data-slot="chip"]') as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set(["chip", "chip--success", "chip--lg", "chip--primary"])
    )
  })

  it("renders composed children as-is without auto-wrapping", () => {
    const { container } = render(() => (
      <ChipRoot color="accent">
        <ChipLabel>Label</ChipLabel>
      </ChipRoot>
    ))

    const labels = container.querySelectorAll('[data-slot="chip-label"]')
    expect(labels.length).toBe(1)
    expect(labels[0].textContent).toBe("Label")
  })

  it("merges consumer classes onto root and label", () => {
    const { container } = render(() => (
      <ChipRoot class="custom-root">
        <ChipLabel class="custom-label">Text</ChipLabel>
      </ChipRoot>
    ))

    const root = container.querySelector('[data-slot="chip"]') as HTMLElement
    expect(root.classList.contains("custom-root")).toBe(true)
    const label = container.querySelector(
      '[data-slot="chip-label"]'
    ) as HTMLElement
    expect(label.classList.contains("custom-label")).toBe(true)
  })
})
