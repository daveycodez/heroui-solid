// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { HeaderRoot } from "./header"

// Header is a thin presentational skin over a <header>. Its Select-section defer
// path is covered by the select/list-box collection suites; these guard only the
// standalone (non-deferred) render: the slot class, data-slot hook, class merge,
// and that it renders a real <header> element.

const bySlot = (c: HTMLElement) =>
  c.querySelector("[data-slot=header]") as HTMLElement

describe("Header (thin skin)", () => {
  it("renders a <header> with the BEM class, data-slot, and children", () => {
    const { container } = render(() => (
      <HeaderRoot class="custom">Section</HeaderRoot>
    ))
    const el = bySlot(container)
    expect(el.tagName).toBe("HEADER")
    expect(el.textContent).toBe("Section")
    expect(classSet(el.className)).toEqual(new Set(["header", "custom"]))
  })
})
