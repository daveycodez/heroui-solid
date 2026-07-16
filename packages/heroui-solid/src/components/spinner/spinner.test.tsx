// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { SpinnerRoot } from "./spinner"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("Spinner", () => {
  it("renders HeroUI's anatomy: span[data-slot=spinner] > svg[data-slot=spinner-icon]", () => {
    const { container } = render(() => (
      <SpinnerRoot color="current" size="sm" class="extra" />
    ))
    const root = container.querySelector('[data-slot="spinner"]')
    expect(root?.tagName).toBe("SPAN")
    expect(classSet(root?.className ?? "")).toEqual(
      new Set(["spinner", "spinner--current", "spinner--sm", "extra"])
    )
    expect(root?.querySelector('svg[data-slot="spinner-icon"]')).toBeTruthy()
  })
})
