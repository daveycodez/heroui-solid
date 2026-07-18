// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { createSignal, For } from "solid-js"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { HeaderRoot } from "../header/header"
import { LabelRoot } from "../label/label"
import {
  ListBoxItem,
  ListBoxItemIndicator,
  ListBoxRoot
} from "../list-box/list-box"
import { ListBoxSectionRoot } from "../list-box-section/list-box-section"
import { SeparatorRoot } from "../separator/separator"
import {
  SelectIndicator,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectValue
} from "./select"

const Anatomy = (props: Parameters<typeof SelectRoot>[0]) => (
  <SelectRoot placeholder="Select one" {...props}>
    <LabelRoot>State</LabelRoot>
    <SelectTrigger>
      <SelectValue />
      <SelectIndicator />
    </SelectTrigger>
    <SelectPopover>
      <ListBoxRoot>
        <ListBoxItem id="florida" textValue="Florida">
          Florida
          <ListBoxItemIndicator />
        </ListBoxItem>
        <ListBoxItem id="texas" textValue="Texas">
          Texas
          <ListBoxItemIndicator />
        </ListBoxItem>
        <ListBoxItem id="california" textValue="California">
          California
          <ListBoxItemIndicator />
        </ListBoxItem>
      </ListBoxRoot>
    </SelectPopover>
  </SelectRoot>
)

const openWithKeyboard = (trigger: HTMLElement) => {
  fireEvent.focus(trigger)
  fireEvent.keyDown(trigger, { key: "ArrowDown" })
}

describe("Select", () => {
  it("renders the closed anatomy with BEM classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)
    const root = container.querySelector("[data-slot=select]") as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set(["select", "select--primary"])
    )

    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    expect(trigger.tagName).toBe("BUTTON")
    expect(classSet(trigger.className)).toEqual(new Set(["select__trigger"]))

    const value = container.querySelector(
      "[data-slot=select-value]"
    ) as HTMLElement
    expect(classSet(value.className)).toEqual(new Set(["select__value"]))
    expect(value.hasAttribute("data-placeholder-shown")).toBe(true)
    expect(value.textContent).toBe("Select one")

    const indicator = container.querySelector(
      "[data-slot=select-default-indicator]"
    ) as HTMLElement
    expect(indicator.tagName.toLowerCase()).toBe("svg")
    expect(classSet(indicator.getAttribute("class") ?? "")).toEqual(
      new Set(["select__indicator"])
    )

    // Popover content stays unmounted until opened
    expect(document.querySelector("[data-slot=select-popover]")).toBeNull()
  })

  it("opens via keyboard and renders the listbox with registered items", () => {
    const { container } = render(() => <Anatomy />)
    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    openWithKeyboard(trigger)

    const popover = document.querySelector(
      "[data-slot=select-popover]"
    ) as HTMLElement
    expect(popover).not.toBeNull()
    expect(classSet(popover.className)).toEqual(new Set(["select__popover"]))

    const listbox = popover.querySelector("[data-slot=list-box]") as HTMLElement
    expect(classSet(listbox.className)).toEqual(
      new Set(["list-box", "list-box--default"])
    )

    const items = popover.querySelectorAll("[data-slot=list-box-item]")
    expect(items.length).toBe(3)
    const first = items[0] as HTMLElement
    expect(first.getAttribute("role")).toBe("option")
    expect(classSet(first.className)).toEqual(
      new Set(["list-box-item", "list-box-item--default"])
    )
    expect(first.textContent).toBe("Florida")

    const indicator = trigger.querySelector(
      "[data-slot=select-default-indicator]"
    ) as HTMLElement
    expect(indicator.getAttribute("data-open")).toBe("true")
  })

  it("renders grouped options with section headers and separators", () => {
    const Sectioned = () => (
      <SelectRoot placeholder="Select a country">
        <LabelRoot>Country</LabelRoot>
        <SelectTrigger>
          <SelectValue />
          <SelectIndicator />
        </SelectTrigger>
        <SelectPopover>
          <ListBoxRoot>
            <ListBoxSectionRoot>
              <HeaderRoot>North America</HeaderRoot>
              <ListBoxItem id="usa" textValue="United States">
                United States
                <ListBoxItemIndicator />
              </ListBoxItem>
              <ListBoxItem id="canada" textValue="Canada">
                Canada
                <ListBoxItemIndicator />
              </ListBoxItem>
            </ListBoxSectionRoot>
            <SeparatorRoot />
            <ListBoxSectionRoot>
              <HeaderRoot>Europe</HeaderRoot>
              <ListBoxItem id="france" textValue="France">
                France
                <ListBoxItemIndicator />
              </ListBoxItem>
            </ListBoxSectionRoot>
          </ListBoxRoot>
        </SelectPopover>
      </SelectRoot>
    )

    const { container } = render(() => <Sectioned />)
    openWithKeyboard(
      container.querySelector("[data-slot=select-trigger]") as HTMLElement
    )

    // All three items across both sections register and render.
    const items = document.querySelectorAll("[data-slot=list-box-item]")
    expect([...items].map((el) => el.textContent)).toEqual([
      "United States",
      "Canada",
      "France"
    ])

    // Both section headers render inside section label rows.
    const sections = document.querySelectorAll("[data-slot=list-box-section]")
    expect([...sections].map((el) => el.textContent)).toEqual([
      "North America",
      "Europe"
    ])

    // The Separator between the two sections renders (deferred until open).
    expect(document.querySelectorAll("[data-slot=separator]").length).toBe(1)
  })

  it("renders a Separator placed before a plain item in a Select", () => {
    const WithLeadingSeparator = () => (
      <SelectRoot placeholder="Select an option">
        <LabelRoot>Option</LabelRoot>
        <SelectTrigger>
          <SelectValue />
          <SelectIndicator />
        </SelectTrigger>
        <SelectPopover>
          <ListBoxRoot>
            <ListBoxItem id="first" textValue="First">
              First
              <ListBoxItemIndicator />
            </ListBoxItem>
            <SeparatorRoot />
            <ListBoxItem id="second" textValue="Second">
              Second
              <ListBoxItemIndicator />
            </ListBoxItem>
          </ListBoxRoot>
        </SelectPopover>
      </SelectRoot>
    )

    const { container } = render(() => <WithLeadingSeparator />)
    openWithKeyboard(
      container.querySelector("[data-slot=select-trigger]") as HTMLElement
    )

    const items = document.querySelectorAll("[data-slot=list-box-item]")
    expect([...items].map((el) => el.textContent)).toEqual(["First", "Second"])
    // The Separator before the second (plain) item renders — previously dropped
    // because the Select registration loop only attached leading to sections.
    expect(document.querySelectorAll("[data-slot=separator]").length).toBe(1)
  })

  it("tracks signal-driven items inside a section", () => {
    const [countries, setCountries] = createSignal(["Sweden", "Norway"])
    const { container } = render(() => (
      <SelectRoot placeholder="Select a country">
        <LabelRoot>Country</LabelRoot>
        <SelectTrigger>
          <SelectValue />
          <SelectIndicator />
        </SelectTrigger>
        <SelectPopover>
          <ListBoxRoot>
            <ListBoxSectionRoot>
              <HeaderRoot>Europe</HeaderRoot>
              <For each={countries()}>
                {(name) => (
                  <ListBoxItem id={name} textValue={name}>
                    {name}
                  </ListBoxItem>
                )}
              </For>
            </ListBoxSectionRoot>
          </ListBoxRoot>
        </SelectPopover>
      </SelectRoot>
    ))
    openWithKeyboard(
      container.querySelector("[data-slot=select-trigger]") as HTMLElement
    )

    const names = () =>
      [...document.querySelectorAll("[data-slot=list-box-item]")].map(
        (el) => el.textContent
      )
    expect(names()).toEqual(["Sweden", "Norway"])

    setCountries(["Sweden", "Norway", "Finland"])
    expect(names()).toEqual(["Sweden", "Norway", "Finland"])
  })

  it("closes the popover when the selected item is activated again", () => {
    const onChange = vi.fn()
    const { container } = render(() => (
      <Anatomy defaultValue="texas" onChange={onChange} />
    ))
    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    openWithKeyboard(trigger)

    const texas = [
      ...document.querySelectorAll("[data-slot=list-box-item]")
    ].find((el) => el.textContent?.includes("Texas")) as HTMLElement
    expect(texas.getAttribute("aria-selected")).toBe("true")
    fireEvent.pointerDown(texas, { pointerId: 1, pointerType: "mouse" })
    fireEvent.click(texas)

    expect(document.querySelector("[data-slot=select-popover]")).toBeNull()
    expect(onChange).not.toHaveBeenCalled()
  })

  it("stamps data-placement for the default bottom placement", () => {
    render(() => <Anatomy defaultOpen />)
    const popover = document.querySelector(
      "[data-slot=select-popover]"
    ) as HTMLElement
    expect(popover.getAttribute("data-placement")).toBe("bottom")
  })

  it("stamps the placement side requested on the popover", () => {
    render(() => (
      <SelectRoot defaultOpen placeholder="Select one">
        <SelectTrigger>
          <SelectValue />
          <SelectIndicator />
        </SelectTrigger>
        <SelectPopover placement="top-start">
          <ListBoxRoot>
            <ListBoxItem id="florida" textValue="Florida">
              Florida
            </ListBoxItem>
          </ListBoxRoot>
        </SelectPopover>
      </SelectRoot>
    ))
    const popover = document.querySelector(
      "[data-slot=select-popover]"
    ) as HTMLElement
    expect(popover.getAttribute("data-placement")).toBe("top")
  })

  it("selects an item and reports the key through onChange", () => {
    const onChange = vi.fn()
    const { container } = render(() => <Anatomy onChange={onChange} />)
    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    openWithKeyboard(trigger)

    // Kobalte gives the focused option real DOM focus; key events land there.
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: "ArrowDown"
    })
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Enter" })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toBe("texas")

    const value = container.querySelector(
      "[data-slot=select-value]"
    ) as HTMLElement
    expect(value.hasAttribute("data-placeholder-shown")).toBe(false)
  })

  it("shows the selected item's textValue for a default value", () => {
    const { container } = render(() => <Anatomy defaultValue="texas" />)
    const value = container.querySelector(
      "[data-slot=select-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("Texas")

    const hiddenSelect = container.querySelector("select") as HTMLSelectElement
    expect(hiddenSelect).not.toBeNull()
  })

  it("reports an array of keys in multiple mode", () => {
    const onChange = vi.fn()
    const { container } = render(() => (
      <Anatomy
        defaultValue={["florida", "texas"]}
        onChange={onChange}
        selectionMode="multiple"
      />
    ))
    const value = container.querySelector(
      "[data-slot=select-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("Florida, Texas")

    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    openWithKeyboard(trigger)
    const listbox = document.querySelector(
      "[data-slot=list-box]"
    ) as HTMLElement
    expect(listbox.getAttribute("aria-multiselectable")).toBe("true")
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Enter" })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(["texas"])
  })

  it("marks disabled keys on the rendered items", () => {
    const { container } = render(() => <Anatomy disabledKeys={["texas"]} />)
    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    openWithKeyboard(trigger)

    const texas = Array.from(
      document.querySelectorAll("[data-slot=list-box-item]")
    ).find((item) => item.textContent === "Texas") as HTMLElement
    expect(texas.getAttribute("aria-disabled")).toBe("true")
    expect(texas.hasAttribute("data-disabled")).toBe(true)
  })

  it("stamps field state on the root and wires the label", () => {
    const { container } = render(() => (
      <Anatomy isDisabled isInvalid isRequired />
    ))
    const root = container.querySelector("[data-slot=select]") as HTMLElement
    expect(root.getAttribute("data-invalid")).toBe("true")
    expect(root.getAttribute("data-required")).toBe("true")
    expect(root.getAttribute("data-disabled")).toBe("true")

    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLButtonElement
    expect(trigger.disabled).toBe(true)

    const label = container.querySelector(
      "[data-slot=label]"
    ) as HTMLLabelElement
    expect(classSet(label.className)).toEqual(new Set(["label"]))
    expect(label.htmlFor).toBe(trigger.id)
  })

  it("applies fullWidth and variant modifiers", () => {
    const { container } = render(() => (
      <Anatomy fullWidth variant="secondary" />
    ))
    const root = container.querySelector("[data-slot=select]") as HTMLElement
    expect(root.classList.contains("select--secondary")).toBe(true)
    expect(root.classList.contains("select--full-width")).toBe(true)
    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    expect(trigger.classList.contains("select__trigger--full-width")).toBe(true)
  })

  it("renders the item indicator only for selected items", () => {
    const { container } = render(() => <Anatomy defaultValue="texas" />)
    const trigger = container.querySelector(
      "[data-slot=select-trigger]"
    ) as HTMLElement
    openWithKeyboard(trigger)

    const items = Array.from(
      document.querySelectorAll("[data-slot=list-box-item]")
    ) as HTMLElement[]
    const texas = items.find((item) => item.textContent?.includes("Texas"))
    const florida = items.find((item) => item.textContent?.includes("Florida"))
    expect(texas?.getAttribute("aria-selected")).toBe("true")
    expect(
      texas?.querySelector("[data-slot=list-box-item-indicator]")
    ).not.toBeNull()
    expect(
      florida?.querySelector("[data-slot=list-box-item-indicator]")
    ).toBeNull()
  })
})
