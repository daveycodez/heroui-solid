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
    // The trigger is a focusable Select.Trigger rendered as a div (role=button,
    // not a native <button>), so the nested clear button and tag remove buttons
    // in the value are valid HTML and keyboard-reachable.
    expect(trigger.tagName).toBe("DIV")
    expect(trigger.getAttribute("role")).toBe("button")
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

    // The default indicator is a plain, non-focusable svg (the trigger owns
    // focus + keyboard opening).
    const indicator = container.querySelector(
      "[data-slot=autocomplete-default-indicator]"
    ) as HTMLElement
    expect(indicator.tagName.toLowerCase()).toBe("svg")
    expect(indicator.getAttribute("tabindex")).toBeNull()
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

  it("shows the selected item's textValue for a default value while closed", () => {
    // Options register during the popover's eager pass (even while closed), so
    // the trigger resolves the selected key's textValue without ever opening.
    const { container } = render(() => <Anatomy defaultValue="texas" />)

    // Popover stays closed.
    expect(
      document.querySelector("[data-slot=autocomplete-popover]")
    ).toBeNull()

    const value = container.querySelector(
      "[data-slot=autocomplete-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("Texas")

    const clearButton = container.querySelector(
      "[data-slot=autocomplete-clear-button]"
    ) as HTMLElement
    expect(clearButton.getAttribute("data-empty")).toBeNull()
  })

  it("navigates options with the keyboard via virtual focus", () => {
    render(() => <Anatomy defaultOpen />)
    const input = searchInput()

    // ArrowDown highlights the first option and points aria-activedescendant at
    // it while the input keeps DOM focus.
    fireEvent.keyDown(input, { key: "ArrowDown" })
    const first = document.querySelector(
      "[data-slot=list-box-item][data-highlighted]"
    ) as HTMLElement
    expect(first).not.toBeNull()
    expect(first.textContent).toContain("Florida")
    expect(input.getAttribute("aria-activedescendant")).toBe(first.id)

    // ArrowDown again moves the highlight to the next option.
    fireEvent.keyDown(input, { key: "ArrowDown" })
    const second = document.querySelector(
      "[data-slot=list-box-item][data-highlighted]"
    ) as HTMLElement
    expect(second.textContent).toContain("Texas")
    expect(input.getAttribute("aria-activedescendant")).toBe(second.id)
  })

  it("selects the active option and closes on Enter (single-select)", () => {
    const onChange = vi.fn()
    const { container } = render(() => (
      <Anatomy defaultOpen onChange={onChange} />
    ))
    const input = searchInput()

    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "ArrowDown" }) // Texas
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onChange).toHaveBeenCalledWith("texas")
    expect(
      document.querySelector("[data-slot=autocomplete-popover]")
    ).toBeNull()
    const value = container.querySelector(
      "[data-slot=autocomplete-value]"
    ) as HTMLElement
    expect(value.textContent).toBe("Texas")
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

    // The trigger is a Select.Trigger div; Kobalte stamps aria-disabled="true"
    // (which the HeroUI CSS keys disabled styling off), plus an empty
    // data-disabled. It also drops the tab stop.
    const trigger = container.querySelector(
      "[data-slot=autocomplete-trigger]"
    ) as HTMLElement
    expect(trigger.getAttribute("aria-disabled")).toBe("true")
    expect(trigger.getAttribute("tabindex")).toBeNull()
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
