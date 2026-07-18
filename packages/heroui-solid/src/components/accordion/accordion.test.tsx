// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { createSignal } from "solid-js"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import type { Key } from "../../utils/types"
import { useDisclosureGroupNavigation } from "../../utils/use-disclosure-group-navigation"
import {
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger
} from "./accordion"

const Anatomy = (props: {
  variant?: "default" | "surface"
  hideSeparator?: boolean
  isDisabled?: boolean
  itemDisabled?: boolean
  allowsMultipleExpanded?: boolean
  expandedKeys?: Iterable<Key>
  defaultExpandedKeys?: Iterable<Key>
  onExpandedChange?: (keys: Set<Key>) => void
  indicator?: boolean
}) => (
  <AccordionRoot
    allowsMultipleExpanded={props.allowsMultipleExpanded}
    class="custom"
    defaultExpandedKeys={props.defaultExpandedKeys}
    expandedKeys={props.expandedKeys}
    hideSeparator={props.hideSeparator}
    isDisabled={props.isDisabled}
    onExpandedChange={props.onExpandedChange}
    variant={props.variant}
  >
    <AccordionItem id="one" isDisabled={props.itemDisabled}>
      <AccordionHeading>
        <AccordionTrigger>
          First
          {props.indicator ? (
            <AccordionIndicator>
              <svg data-testid="custom-icon" />
            </AccordionIndicator>
          ) : (
            <AccordionIndicator />
          )}
        </AccordionTrigger>
      </AccordionHeading>
      <AccordionPanel>
        <AccordionBody>First content</AccordionBody>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem id="two">
      <AccordionHeading>
        <AccordionTrigger>
          Second
          <AccordionIndicator />
        </AccordionTrigger>
      </AccordionHeading>
      <AccordionPanel>
        <AccordionBody>Second content</AccordionBody>
      </AccordionPanel>
    </AccordionItem>
  </AccordionRoot>
)

const trigger = (container: HTMLElement, index = 0) =>
  container.querySelectorAll("[data-slot=accordion-trigger]")[
    index
  ] as HTMLButtonElement

const panel = (container: HTMLElement, index = 0) =>
  container.querySelectorAll("[data-slot=accordion-panel]")[
    index
  ] as HTMLElement

describe("Accordion", () => {
  it("renders the full anatomy with slot classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)
    const root = container.querySelector("[data-slot=accordion]") as HTMLElement
    expect(root.tagName).toBe("DIV")
    expect(classSet(root.className)).toEqual(new Set(["accordion", "custom"]))

    const parts: Array<[string, string, string]> = [
      ["accordion-item", "accordion__item", "DIV"],
      ["accordion-heading", "accordion__heading", "H3"],
      ["accordion-trigger", "accordion__trigger", "BUTTON"],
      ["accordion-indicator", "accordion__indicator", "svg"],
      ["accordion-panel", "accordion__panel", "DIV"],
      ["accordion-body", "accordion__body", "DIV"]
    ]
    for (const [slot, className, tagName] of parts) {
      const el = container.querySelector(`[data-slot=${slot}]`) as HTMLElement
      expect(el.tagName.toLowerCase()).toBe(tagName.toLowerCase())
      expect(classSet(el.getAttribute("class") ?? "")).toEqual(
        new Set([className])
      )
    }

    const body = container.querySelector(
      "[data-slot=accordion-body]"
    ) as HTMLElement
    const inner = body.firstElementChild as HTMLElement
    expect(classSet(inner.className)).toEqual(
      new Set(["accordion__body-inner"])
    )
  })

  it("applies the surface variant modifier on the root only", () => {
    const { container } = render(() => <Anatomy variant="surface" />)
    const root = container.querySelector("[data-slot=accordion]") as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set(["accordion", "accordion--surface", "custom"])
    )
    const item = container.querySelector(
      "[data-slot=accordion-item]"
    ) as HTMLElement
    expect(classSet(item.className)).toEqual(new Set(["accordion__item"]))
  })

  it("expands and collapses on trigger click", () => {
    const { container } = render(() => <Anatomy />)
    expect(trigger(container).getAttribute("aria-expanded")).toBe("false")
    expect(panel(container).hasAttribute("hidden")).toBe(true)
    expect(panel(container).getAttribute("data-expanded")).toBeNull()

    fireEvent.click(trigger(container))
    expect(trigger(container).getAttribute("aria-expanded")).toBe("true")
    expect(panel(container).hasAttribute("hidden")).toBe(false)
    expect(panel(container).getAttribute("data-expanded")).toBe("true")
    expect(panel(container).getAttribute("aria-hidden")).toBe("false")

    fireEvent.click(trigger(container))
    expect(trigger(container).getAttribute("aria-expanded")).toBe("false")
    expect(panel(container).hasAttribute("hidden")).toBe(true)
  })

  it("collapses the open item when another opens in single mode", () => {
    const { container } = render(() => <Anatomy />)
    fireEvent.click(trigger(container, 0))
    fireEvent.click(trigger(container, 1))
    expect(trigger(container, 0).getAttribute("aria-expanded")).toBe("false")
    expect(trigger(container, 1).getAttribute("aria-expanded")).toBe("true")
  })

  it("keeps items open with allowsMultipleExpanded", () => {
    const { container } = render(() => <Anatomy allowsMultipleExpanded />)
    fireEvent.click(trigger(container, 0))
    fireEvent.click(trigger(container, 1))
    expect(trigger(container, 0).getAttribute("aria-expanded")).toBe("true")
    expect(trigger(container, 1).getAttribute("aria-expanded")).toBe("true")
  })

  it("expands initially from defaultExpandedKeys", () => {
    const { container } = render(() => (
      <Anatomy defaultExpandedKeys={["two"]} />
    ))
    expect(trigger(container, 1).getAttribute("aria-expanded")).toBe("true")
    expect(panel(container, 1).hasAttribute("hidden")).toBe(false)
  })

  it("supports controlled expandedKeys with onExpandedChange", () => {
    const onExpandedChange = vi.fn()
    const [keys, setKeys] = createSignal<Set<Key>>(new Set(["one"]))
    const { container } = render(() => (
      <Anatomy
        expandedKeys={keys()}
        onExpandedChange={(next) => {
          onExpandedChange(next)
          setKeys(next)
        }}
      />
    ))
    expect(trigger(container, 0).getAttribute("aria-expanded")).toBe("true")

    fireEvent.click(trigger(container, 1))
    expect(onExpandedChange).toHaveBeenCalledWith(new Set(["two"]))
    expect(trigger(container, 1).getAttribute("aria-expanded")).toBe("true")
    expect(trigger(container, 0).getAttribute("aria-expanded")).toBe("false")
  })

  it("disables every trigger with isDisabled on the root", () => {
    const { container } = render(() => <Anatomy isDisabled />)
    expect(trigger(container, 0).disabled).toBe(true)
    expect(trigger(container, 1).disabled).toBe(true)
    fireEvent.click(trigger(container, 0))
    expect(trigger(container, 0).getAttribute("aria-expanded")).toBe("false")
  })

  it("disables a single item with isDisabled on the item", () => {
    const { container } = render(() => <Anatomy itemDisabled />)
    expect(trigger(container, 0).disabled).toBe(true)
    expect(trigger(container, 1).disabled).toBe(false)
  })

  it("stamps data-hide-separator on items when hideSeparator is set", () => {
    const { container } = render(() => <Anatomy hideSeparator />)
    const items = container.querySelectorAll("[data-slot=accordion-item]")
    for (const item of items) {
      expect(item.getAttribute("data-hide-separator")).toBe("true")
    }
  })

  it("rotates the indicator via data-expanded", () => {
    const { container } = render(() => <Anatomy />)
    const indicator = container.querySelector(
      "[data-slot=accordion-indicator]"
    ) as HTMLElement
    expect(indicator.getAttribute("data-expanded")).toBeNull()
    fireEvent.click(trigger(container))
    expect(indicator.getAttribute("data-expanded")).toBe("true")
  })

  it("wraps a custom indicator icon with the slot class", () => {
    const { container, getByTestId } = render(() => <Anatomy indicator />)
    const indicator = container.querySelector(
      "[data-slot=accordion-indicator]"
    ) as HTMLElement
    expect(indicator.tagName).toBe("SPAN")
    expect(classSet(indicator.className)).toEqual(
      new Set(["accordion__indicator"])
    )
    expect(indicator.contains(getByTestId("custom-icon"))).toBe(true)
  })
})

describe("useDisclosureGroupNavigation", () => {
  const itemIds = ["a", "b", "c"]

  it("navigates to the next and previous items", () => {
    const [keys, setKeys] = createSignal<Set<Key>>(new Set(["a"]))
    const nav = useDisclosureGroupNavigation({
      expandedKeys: keys,
      itemIds,
      onExpandedChange: setKeys
    })
    expect(nav.currentIndex()).toBe(0)
    expect(nav.isPrevDisabled()).toBe(true)
    expect(nav.isNextDisabled()).toBe(false)

    nav.onNext()
    expect(keys()).toEqual(new Set(["b"]))
    nav.onNext()
    expect(keys()).toEqual(new Set(["c"]))
    expect(nav.isNextDisabled()).toBe(true)

    nav.onNext()
    expect(keys()).toEqual(new Set(["c"]))

    nav.onPrevious()
    expect(keys()).toEqual(new Set(["b"]))
  })

  it("falls back to the first item when nothing is expanded", () => {
    const [keys, setKeys] = createSignal<Set<Key>>(new Set())
    const nav = useDisclosureGroupNavigation({
      expandedKeys: keys,
      itemIds,
      onExpandedChange: setKeys
    })
    expect(nav.currentIndex()).toBe(0)
    nav.onNext()
    expect(keys()).toEqual(new Set(["b"]))
  })

  it("accumulates keys with allowsMultipleExpanded", () => {
    const [keys, setKeys] = createSignal<Set<Key>>(new Set(["a"]))
    const nav = useDisclosureGroupNavigation({
      allowsMultipleExpanded: true,
      expandedKeys: keys,
      itemIds,
      onExpandedChange: setKeys
    })
    nav.onNext()
    expect(keys()).toEqual(new Set(["a", "b"]))
  })

  it("returns -1 with no items", () => {
    const [keys, setKeys] = createSignal<Set<Key>>(new Set())
    const nav = useDisclosureGroupNavigation({
      expandedKeys: keys,
      itemIds: [],
      onExpandedChange: setKeys
    })
    expect(nav.currentIndex()).toBe(-1)
    expect(nav.isPrevDisabled()).toBe(true)
    expect(nav.isNextDisabled()).toBe(true)
  })
})
