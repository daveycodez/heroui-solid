// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { DescriptionRoot } from "../description/description"
import { FieldErrorRoot } from "../field-error/field-error"
import { LabelRoot } from "../label/label"
import {
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
} from "./search-field"

const Anatomy = (props: Parameters<typeof SearchFieldRoot>[0]) => (
  <SearchFieldRoot {...props}>
    <LabelRoot>Search</LabelRoot>
    <SearchFieldGroup>
      <SearchFieldSearchIcon />
      <SearchFieldInput placeholder="Search..." />
      <SearchFieldClearButton />
    </SearchFieldGroup>
    <DescriptionRoot>Enter keywords to search.</DescriptionRoot>
    <FieldErrorRoot>Search is required.</FieldErrorRoot>
  </SearchFieldRoot>
)

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe("SearchField", () => {
  it("renders the anatomy with BEM classes and accessibility wiring", () => {
    const { container, getByRole } = render(() => <Anatomy />)
    const root = slot(container, "search-field")
    expect(classSet(root.className)).toEqual(
      new Set(["search-field", "search-field--primary"])
    )

    const group = slot(container, "search-field-group")
    expect(classSet(group.className)).toEqual(new Set(["search-field__group"]))

    const input = getByRole("searchbox") as HTMLInputElement
    expect(input.type).toBe("search")
    expect(classSet(input.className)).toEqual(new Set(["search-field__input"]))

    const label = slot(container, "label") as HTMLLabelElement
    expect(label.htmlFor).toBe(input.id)
    expect(slot(container, "search-field-search-icon")).not.toBeNull()
    expect(slot(container, "search-field-clear-button")).not.toBeNull()
  })

  it("marks the root empty and drops the flag once it has a value", () => {
    const { container } = render(() => <Anatomy defaultValue="" />)
    const root = slot(container, "search-field")
    expect(root.getAttribute("data-empty")).toBe("true")

    const { container: filled } = render(() => <Anatomy defaultValue="hero" />)
    expect(slot(filled, "search-field").hasAttribute("data-empty")).toBe(false)
  })

  it("clears the value from the clear button and refocuses the input", () => {
    const onChange = vi.fn()
    const { container, getByRole } = render(() => (
      <Anatomy defaultValue="hero" onChange={onChange} />
    ))
    const input = getByRole("searchbox") as HTMLInputElement
    expect(input.value).toBe("hero")

    fireEvent.click(slot(container, "search-field-clear-button"))
    expect(onChange).toHaveBeenCalledWith("")
    expect(input.value).toBe("")
    expect(slot(container, "search-field").getAttribute("data-empty")).toBe(
      "true"
    )
    expect(document.activeElement).toBe(input)
  })

  it("clears the value on Escape", () => {
    const onChange = vi.fn()
    const { getByRole } = render(() => (
      <Anatomy defaultValue="hero" onChange={onChange} />
    ))
    const input = getByRole("searchbox") as HTMLInputElement
    fireEvent.keyDown(input, { key: "Escape" })
    expect(onChange).toHaveBeenCalledWith("")
  })

  it("submits the current value on Enter", () => {
    const onSubmit = vi.fn()
    const { getByRole } = render(() => (
      <Anatomy defaultValue="hero" onSubmit={onSubmit} />
    ))
    fireEvent.keyDown(getByRole("searchbox"), { key: "Enter" })
    expect(onSubmit).toHaveBeenCalledWith("hero")
  })

  it("bridges invalid state onto the root and group and shows the error", () => {
    const { container, getByRole } = render(() => <Anatomy isInvalid />)
    expect(slot(container, "search-field").getAttribute("data-invalid")).toBe(
      "true"
    )
    expect(
      slot(container, "search-field-group").getAttribute("data-invalid")
    ).toBe("true")
    expect(slot(container, "field-error")).not.toBeNull()
    expect(getByRole("searchbox").getAttribute("aria-invalid")).toBe("true")
  })

  it("bridges disabled state onto the group and input", () => {
    const { container, getByRole } = render(() => <Anatomy isDisabled />)
    expect(
      slot(container, "search-field-group").getAttribute("data-disabled")
    ).toBe("true")
    expect((getByRole("searchbox") as HTMLInputElement).disabled).toBe(true)
  })

  it("applies the secondary variant and fullWidth to the base and group", () => {
    const { container } = render(() => (
      <Anatomy variant="secondary" fullWidth />
    ))
    const root = slot(container, "search-field")
    expect(root.classList.contains("search-field--secondary")).toBe(true)
    expect(root.classList.contains("search-field--full-width")).toBe(true)
    expect(
      slot(container, "search-field-group").classList.contains(
        "search-field__group--full-width"
      )
    ).toBe(true)
  })

  it("controls the value and reports changes", () => {
    const onChange = vi.fn()
    const { getByRole } = render(() => (
      <SearchFieldRoot value="hero" onChange={onChange}>
        <SearchFieldGroup>
          <SearchFieldInput />
        </SearchFieldGroup>
      </SearchFieldRoot>
    ))
    const input = getByRole("searchbox") as HTMLInputElement
    expect(input.value).toBe("hero")
    fireEvent.input(input, { target: { value: "heroui" } })
    expect(onChange).toHaveBeenCalledWith("heroui")
  })

  it("wraps a custom search icon in the slot", () => {
    const { container } = render(() => (
      <SearchFieldRoot>
        <SearchFieldGroup>
          <SearchFieldSearchIcon>
            <svg data-testid="custom-icon" />
          </SearchFieldSearchIcon>
          <SearchFieldInput />
        </SearchFieldGroup>
      </SearchFieldRoot>
    ))
    const icon = slot(container, "search-field-search-icon")
    expect(icon.classList.contains("search-field__search-icon")).toBe(true)
    expect(icon.querySelector("[data-testid=custom-icon]")).not.toBeNull()
  })
})
