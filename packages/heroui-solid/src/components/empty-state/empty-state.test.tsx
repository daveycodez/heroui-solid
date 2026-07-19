// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { EmptyStateRoot } from "./empty-state"

// EmptyState is a thin presentational skin — a themed polymorphic element with a
// default message. These guard only what we own: the slot class, data-slot hook,
// class merging, the "No results found" fallback, and the polymorphic `as`.

const bySlot = (c: HTMLElement) =>
  c.querySelector("[data-slot=empty-state]") as HTMLElement

describe("EmptyState (thin skin)", () => {
  it("renders custom children with the BEM class and data-slot", () => {
    const { container } = render(() => (
      <EmptyStateRoot class="custom">Nothing here</EmptyStateRoot>
    ))
    const el = bySlot(container)
    expect(el.textContent).toBe("Nothing here")
    expect(classSet(el.className)).toEqual(new Set(["empty-state", "custom"]))
  })

  it("falls back to the default message when empty", () => {
    const { container } = render(() => <EmptyStateRoot />)
    expect(bySlot(container).textContent).toBe("No results found")
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => <EmptyStateRoot as="p" />)
    expect(bySlot(container).tagName).toBe("P")
  })
})
