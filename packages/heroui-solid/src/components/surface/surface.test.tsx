// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { SurfaceRoot } from "./surface"

describe("Surface", () => {
  it("renders a div with BEM classes, data-slot and caller class last", () => {
    const { container } = render(() => (
      <SurfaceRoot class="custom">Content</SurfaceRoot>
    ))
    const surface = container.querySelector(
      "[data-slot=surface]"
    ) as HTMLElement
    expect(surface.tagName).toBe("DIV")
    expect(classSet(surface.className)).toEqual(
      new Set(["surface", "surface--default", "custom"])
    )
  })

  it("applies variant modifiers", () => {
    const { container } = render(() => (
      <SurfaceRoot variant="secondary">Content</SurfaceRoot>
    ))
    const surface = container.querySelector(
      "[data-slot=surface]"
    ) as HTMLElement
    expect(surface.classList.contains("surface--secondary")).toBe(true)
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => (
      <SurfaceRoot as="section">Content</SurfaceRoot>
    ))
    const surface = container.querySelector(
      "[data-slot=surface]"
    ) as HTMLElement
    expect(surface.tagName).toBe("SECTION")
  })
})
