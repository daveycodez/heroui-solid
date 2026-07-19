// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import type { JSX } from "solid-js"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import {
  AccordionContent,
  AccordionHeader,
  AccordionIndicator,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "./accordion"

// The behavior (toggle, keyboard, aria, collapsible, focus) is Kobalte's and
// is not retested here. These guard only the thin skin we own: slot classes,
// data-slot hooks, the variant modifier, class merging, and the Indicator.

const renderAccordion = (
  props: {
    variant?: "default" | "surface"
    indicator?: JSX.Element
    hideSeparator?: boolean
  } = {}
) =>
  render(() => (
    <AccordionRoot
      variant={props.variant}
      hideSeparator={props.hideSeparator}
      defaultValue={["a"]}
    >
      <AccordionItem value="a" class="item-custom">
        <AccordionHeader>
          <AccordionTrigger class="trigger-custom">
            Trigger
            <AccordionIndicator>{props.indicator}</AccordionIndicator>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Body</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  ))

const bySlot = (root: HTMLElement, slot: string) => {
  const el = root.querySelector(`[data-slot="${slot}"]`)
  if (!el) throw new Error(`no element with data-slot="${slot}"`)
  return el
}

describe("Accordion (thin skin)", () => {
  it("stamps each part with its slot class and data-slot", () => {
    const { container } = renderAccordion()

    const cases: [slot: string, cls: string][] = [
      ["accordion", "accordion"],
      ["accordion-item", "accordion__item"],
      ["accordion-heading", "accordion__heading"],
      ["accordion-trigger", "accordion__trigger"],
      ["accordion-panel", "accordion__panel"],
      ["accordion-indicator", "accordion__indicator"]
    ]

    for (const [slot, cls] of cases) {
      const el = bySlot(container, slot)
      expect(classSet(el.className).has(cls), `${slot} → .${cls}`).toBe(true)
    }
  })

  it("merges the caller's class after the slot class", () => {
    const { container } = renderAccordion()
    expect(classSet(bySlot(container, "accordion-item").className)).toEqual(
      new Set(["accordion__item", "item-custom"])
    )
    expect(classSet(bySlot(container, "accordion-trigger").className)).toEqual(
      new Set(["accordion__trigger", "trigger-custom"])
    )
  })

  it("adds the surface modifier to the base only for variant=surface", () => {
    const plain = renderAccordion()
    expect(
      classSet(bySlot(plain.container, "accordion").className).has(
        "accordion--surface"
      )
    ).toBe(false)

    const surface = renderAccordion({ variant: "surface" })
    expect(
      classSet(bySlot(surface.container, "accordion").className).has(
        "accordion--surface"
      )
    ).toBe(true)
  })

  it("stamps data-hide-separator on each item only when hideSeparator is set", () => {
    const off = renderAccordion()
    expect(
      bySlot(off.container, "accordion-item").getAttribute(
        "data-hide-separator"
      )
    ).toBeNull()

    const on = renderAccordion({ hideSeparator: true })
    expect(
      bySlot(on.container, "accordion-item").getAttribute("data-hide-separator")
    ).toBe("true")
  })

  it("renders a default chevron when the Indicator has no children", () => {
    const { container } = renderAccordion()
    expect(
      bySlot(container, "accordion-indicator").querySelector("svg")
    ).not.toBeNull()
  })

  it("renders provided children instead of the default chevron", () => {
    const { container } = renderAccordion({
      indicator: <span data-testid="custom-indicator">+</span>
    })
    const indicator = bySlot(container, "accordion-indicator")
    expect(
      indicator.querySelector('[data-testid="custom-indicator"]')
    ).not.toBeNull()
    expect(indicator.querySelector("svg")).toBeNull()
  })
})
