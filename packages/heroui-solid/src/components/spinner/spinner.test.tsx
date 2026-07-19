// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { SpinnerRoot } from "./spinner"

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

  it("announces as a status region labeled Loading by default", () => {
    const { container } = render(() => <SpinnerRoot />)
    const root = container.querySelector('[data-slot="spinner"]')
    expect(root?.getAttribute("role")).toBe("status")
    expect(root?.getAttribute("aria-label")).toBe("Loading")
  })

  it("lets consumers localize the label via aria-label", () => {
    const { container } = render(() => <SpinnerRoot aria-label="Chargement" />)
    const root = container.querySelector('[data-slot="spinner"]')
    expect(root?.getAttribute("aria-label")).toBe("Chargement")
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => <SpinnerRoot as="button" />)
    const root = container.querySelector('[data-slot="spinner"]')
    expect(root?.tagName).toBe("BUTTON")
  })
})
