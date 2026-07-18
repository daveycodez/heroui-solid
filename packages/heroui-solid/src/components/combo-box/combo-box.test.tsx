// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { InputRoot } from "../input/input"
import { LabelRoot } from "../label/label"
import {
  ListBoxItem,
  ListBoxItemIndicator,
  ListBoxRoot
} from "../list-box/list-box"
import {
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger
} from "./combo-box"

const Anatomy = (props: Parameters<typeof ComboBoxRoot>[0]) => (
  <ComboBoxRoot {...props}>
    <LabelRoot>Favorite Animal</LabelRoot>
    <ComboBoxInputGroup>
      <InputRoot placeholder="Search animals..." />
      <ComboBoxTrigger />
    </ComboBoxInputGroup>
    <ComboBoxPopover>
      <ListBoxRoot>
        <ListBoxItem id="cat" textValue="Cat">
          Cat
          <ListBoxItemIndicator />
        </ListBoxItem>
        <ListBoxItem id="dog" textValue="Dog">
          Dog
          <ListBoxItemIndicator />
        </ListBoxItem>
        <ListBoxItem id="kangaroo" textValue="Kangaroo">
          Kangaroo
          <ListBoxItemIndicator />
        </ListBoxItem>
      </ListBoxRoot>
    </ComboBoxPopover>
  </ComboBoxRoot>
)

describe("ComboBox", () => {
  it("renders the closed anatomy with BEM classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)

    const root = container.querySelector("[data-slot=combo-box]") as HTMLElement
    expect(classSet(root.className)).toEqual(new Set(["combo-box"]))

    const inputGroup = container.querySelector(
      "[data-slot=combo-box-input-group]"
    ) as HTMLElement
    expect(classSet(inputGroup.className)).toEqual(
      new Set(["combo-box__input-group"])
    )

    const input = container.querySelector(
      "[data-slot=input]"
    ) as HTMLInputElement
    expect(input.tagName).toBe("INPUT")
    // Renders as Kobalte's ComboboxInput, wiring the combobox a11y roles.
    expect(input.getAttribute("role")).toBe("combobox")
    expect(input.getAttribute("aria-autocomplete")).toBe("list")
    expect(input.getAttribute("aria-expanded")).toBe("false")

    const trigger = container.querySelector(
      "[data-slot=combo-box-trigger]"
    ) as HTMLElement
    expect(trigger.tagName).toBe("BUTTON")
    expect(classSet(trigger.className)).toEqual(new Set(["combo-box__trigger"]))
    expect(
      trigger.querySelector("[data-slot=combo-box-trigger-default-icon]")
    ).not.toBeNull()

    // Popover content stays unmounted until opened.
    expect(document.querySelector("[data-slot=combo-box-popover]")).toBeNull()
  })

  it("opens on trigger press and renders the registered options", () => {
    const { container } = render(() => <Anatomy />)
    const trigger = container.querySelector(
      "[data-slot=combo-box-trigger]"
    ) as HTMLElement

    // Kobalte's trigger toggles the popover on pointer down (main button).
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" })
    fireEvent.click(trigger)

    const popover = document.querySelector(
      "[data-slot=combo-box-popover]"
    ) as HTMLElement
    expect(popover).not.toBeNull()
    expect(classSet(popover.className)).toEqual(new Set(["combo-box__popover"]))

    const input = container.querySelector(
      "[data-slot=input]"
    ) as HTMLInputElement
    expect(input.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.getAttribute("data-open")).toBe("true")

    const items = popover.querySelectorAll("[data-slot=list-box-item]")
    expect([...items].map((el) => el.textContent)).toEqual([
      "Cat",
      "Dog",
      "Kangaroo"
    ])
  })

  it("filters the options as the user types", () => {
    const { container } = render(() => <Anatomy />)
    const trigger = container.querySelector(
      "[data-slot=combo-box-trigger]"
    ) as HTMLElement
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" })
    fireEvent.click(trigger)

    const input = container.querySelector(
      "[data-slot=input]"
    ) as HTMLInputElement
    input.value = "ka"
    fireEvent.input(input, { target: { value: "ka" } })

    const items = document.querySelectorAll("[data-slot=list-box-item]")
    expect([...items].map((el) => el.textContent)).toEqual(["Kangaroo"])
  })

  it("selects an option and fills the input", () => {
    const { container } = render(() => <Anatomy defaultSelectedKey="dog" />)

    const input = container.querySelector(
      "[data-slot=input]"
    ) as HTMLInputElement
    // Kobalte writes the selected option's label into the input on selection.
    expect(input.value).toBe("Dog")
  })

  it("marks disabled options via disabledKeys", () => {
    const { container } = render(() => (
      <ComboBoxRoot disabledKeys={["dog"]}>
        <LabelRoot>Animal</LabelRoot>
        <ComboBoxInputGroup>
          <InputRoot placeholder="Search animals..." />
          <ComboBoxTrigger />
        </ComboBoxInputGroup>
        <ComboBoxPopover>
          <ListBoxRoot>
            <ListBoxItem id="cat" textValue="Cat">
              Cat
              <ListBoxItemIndicator />
            </ListBoxItem>
            <ListBoxItem id="dog" textValue="Dog">
              Dog
              <ListBoxItemIndicator />
            </ListBoxItem>
          </ListBoxRoot>
        </ComboBoxPopover>
      </ComboBoxRoot>
    ))
    const trigger = container.querySelector(
      "[data-slot=combo-box-trigger]"
    ) as HTMLElement
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" })
    fireEvent.click(trigger)

    const items = document.querySelectorAll("[data-slot=list-box-item]")
    const dog = [...items].find((el) => el.textContent === "Dog") as HTMLElement
    expect(dog.getAttribute("data-disabled")).not.toBeNull()
  })
})
