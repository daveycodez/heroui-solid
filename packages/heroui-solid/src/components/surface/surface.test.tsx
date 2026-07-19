// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { useContext } from "solid-js"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { SurfaceContext, SurfaceRoot } from "./surface"

// Surface is presentational. These guard only the thin skin we own: slot class,
// data-slot, variant modifiers, class merging, the polymorphic `as`, and the
// SurfaceContext variant it provides to descendants.

describe("Surface (thin skin)", () => {
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

  it("provides its variant to descendants via SurfaceContext", () => {
    let seen: string | undefined
    const Probe = () => {
      seen = useContext(SurfaceContext).variant
      return null
    }
    render(() => (
      <SurfaceRoot variant="secondary">
        <Probe />
      </SurfaceRoot>
    ))
    expect(seen).toBe("secondary")
  })

  it("defaults the provided context variant to default", () => {
    let seen: string | undefined
    const Probe = () => {
      seen = useContext(SurfaceContext).variant
      return null
    }
    render(() => (
      <SurfaceRoot>
        <Probe />
      </SurfaceRoot>
    ))
    expect(seen).toBe("default")
  })
})
