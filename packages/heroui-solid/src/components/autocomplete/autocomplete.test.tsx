// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { LabelRoot } from "../label/label"
import {
  ListBoxItem,
  ListBoxItemIndicator,
  ListBoxRoot
} from "../list-box/list-box"
import {
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
} from "../search-field/search-field"
import {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue
} from "./autocomplete"

const contains = (text: string, input: string) =>
  text.toLowerCase().includes(input.toLowerCase())

const Anatomy = (props: Parameters<typeof AutocompleteRoot>[0]) => (
  <AutocompleteRoot placeholder="Select one" {...props}>
    <LabelRoot>State</LabelRoot>
    <AutocompleteTrigger>
      <AutocompleteValue />
      <AutocompleteClearButton />
      <AutocompleteIndicator />
    </AutocompleteTrigger>
    <AutocompletePopover>
      <AutocompleteFilter filter={contains}>
        <SearchFieldRoot name="search" variant="secondary">
          <SearchFieldGroup>
            <SearchFieldSearchIcon />
            <SearchFieldInput placeholder="Search states..." />
          </SearchFieldGroup>
        </SearchFieldRoot>
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
      </AutocompleteFilter>
    </AutocompletePopover>
  </AutocompleteRoot>
)

const searchInput = () =>
  document.querySelector(
    "[data-slot=autocomplete-popover] input"
  ) as HTMLInputElement

const itemTexts = () =>
  [...document.querySelectorAll("[data-slot=list-box-item]")].map(
    (el) => el.textContent
  )

describe("Autocomplete", () => {
  it("renders the closed anatomy with BEM classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)

    const root = container.querySelector(
      "[data-slot=autocomplete]"
    ) as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set(["autocomplete", "autocomplete--primary"])
    )

    const trigger = container.querySelector(
      "[data-slot=autocomplete-trigger]"
    ) as HTMLElement
    expect(trigger.tagName).toBe("BUTTON")
    expect(trigger.classList.contains("autocomplete__trigger")).toBe(true)

    const value = container.querySelector(
      "[data-slot=autocomplete-value]"
    ) as HTMLElement
    expect(value.classList.contains("autocomplete__value")).toBe(true)
    expect(value.textContent).toBe("Select one")

    const clearButton = container.querySelector(
      "[data-slot=autocomplete-clear-button]"
    ) as HTMLElement
    expect(clearButton.tagName).toBe("BUTTON")
    expect(clearButton.classList.contains("autocomplete__clear-button")).toBe(
      true
    )
    // No selection yet — the clear button marks itself empty.
    expect(clearButton.getAttribute("data-empty")).toBe("true")

    const indicator = container.querySelector(
      "[data-slot=autocomplete-default-indicator]"
    ) as HTMLElement
    expect(indicator.tagName.toLowerCase()).toBe("svg")
    expect(
      classSet(indicator.getAttribute("class") ?? "").has(
        "autocomplete__indicator"
      )
    ).toBe(true)

    // Popover content stays unmounted until opened.
    expect(
      document.querySelector("[data-slot=autocomplete-popover]")
    ).toBeNull()
  })

  it("opens and renders the search field and registered items", () => {
    render(() => <Anatomy defaultOpen />)

    const popover = document.querySelector(
      "[data-slot=autocomplete-popover]"
    ) as HTMLElement
    expect(popover).not.toBeNull()
    expect(popover.classList.contains("autocomplete__popover")).toBe(true)

    const filter = popover.querySelector(
      "[data-slot=autocomplete-filter]"
    ) as HTMLElement
    expect(filter).not.toBeNull()

    expect(searchInput()).not.toBeNull()

    expect(itemTexts()).toEqual(["Florida", "Texas", "California"])
  })

  it("filters the options as the search input changes", () => {
    render(() => <Anatomy defaultOpen />)
    expect(itemTexts()).toEqual(["Florida", "Texas", "California"])

    const input = searchInput()
    fireEvent.input(input, { target: { value: "flor" } })
    expect(itemTexts()).toEqual(["Florida"])

    fireEvent.input(input, { target: { value: "" } })
    expect(itemTexts()).toEqual(["Florida", "Texas", "California"])
  })

  it("shows the selected item's textValue for a default value once options register", () => {
    // Options register when the popover opens, so the trigger resolves the
    // selected key's textValue after opening (mirrors the on-open registration
    // the SSR/hydration design requires).
    const { container } = render(() => (
      <Anatomy defaultOpen defaultValue="texas" />
    ))
    const value = container.querySelector(
      "[data-slot=autocomplete-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("Texas")

    const clearButton = container.querySelector(
      "[data-slot=autocomplete-clear-button]"
    ) as HTMLElement
    expect(clearButton.getAttribute("data-empty")).toBeNull()
  })

  it("supports a render-function value in multiple mode", () => {
    const { container } = render(() => (
      <AutocompleteRoot
        defaultOpen
        defaultValue={["florida", "texas"]}
        placeholder="Select states"
        selectionMode="multiple"
      >
        <AutocompleteTrigger>
          <AutocompleteValue>
            {({ defaultChildren, isPlaceholder, state }) => {
              if (isPlaceholder || state.selectedItems.length === 0) {
                return defaultChildren
              }

              return <span>{state.selectedItems.length} selected</span>
            }}
          </AutocompleteValue>
          <AutocompleteIndicator />
        </AutocompleteTrigger>
        <AutocompletePopover>
          <AutocompleteFilter filter={contains}>
            <SearchFieldRoot name="search">
              <SearchFieldGroup>
                <SearchFieldInput placeholder="Search..." />
              </SearchFieldGroup>
            </SearchFieldRoot>
            <ListBoxRoot>
              <ListBoxItem id="florida" textValue="Florida">
                Florida
              </ListBoxItem>
              <ListBoxItem id="texas" textValue="Texas">
                Texas
              </ListBoxItem>
            </ListBoxRoot>
          </AutocompleteFilter>
        </AutocompletePopover>
      </AutocompleteRoot>
    ))

    const value = container.querySelector(
      "[data-slot=autocomplete-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("2 selected")
  })

  it("applies fullWidth and variant modifiers", () => {
    const { container } = render(() => (
      <Anatomy fullWidth variant="secondary" />
    ))
    const root = container.querySelector(
      "[data-slot=autocomplete]"
    ) as HTMLElement
    expect(root.classList.contains("autocomplete--secondary")).toBe(true)
    expect(root.classList.contains("autocomplete--full-width")).toBe(true)
  })

  it("stamps field state on the root and wires the label", () => {
    const { container } = render(() => (
      <Anatomy isDisabled isInvalid isRequired />
    ))
    const root = container.querySelector(
      "[data-slot=autocomplete]"
    ) as HTMLElement
    expect(root.getAttribute("data-invalid")).toBe("true")
    expect(root.getAttribute("data-required")).toBe("true")
    expect(root.getAttribute("data-disabled")).toBe("true")

    const trigger = container.querySelector(
      "[data-slot=autocomplete-trigger]"
    ) as HTMLButtonElement
    expect(trigger.disabled).toBe(true)
  })

  it("clears the selection when the clear button is pressed", () => {
    const onChange = vi.fn()
    const { container } = render(() => (
      <Anatomy defaultOpen defaultValue="texas" onChange={onChange} />
    ))
    const value = container.querySelector(
      "[data-slot=autocomplete-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("Texas")

    const clearButton = container.querySelector(
      "[data-slot=autocomplete-clear-button]"
    ) as HTMLElement
    fireEvent.click(clearButton)

    expect(value.textContent).toBe("Select one")
  })
})
