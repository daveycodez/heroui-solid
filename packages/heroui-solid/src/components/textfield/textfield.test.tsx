// @vitest-environment jsdom
import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { DescriptionRoot } from "../description/description"
import { FieldErrorRoot } from "../field-error/field-error"
import { InputRoot } from "../input/input"
import { LabelRoot } from "../label/label"
import { TextAreaRoot } from "../textarea/textarea"
import { TextFieldRoot } from "./textfield"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

const Anatomy = (props: Parameters<typeof TextFieldRoot>[0]) => (
  <TextFieldRoot {...props}>
    <LabelRoot>Email</LabelRoot>
    <InputRoot placeholder="Enter your email" />
    <DescriptionRoot>We'll never share your email.</DescriptionRoot>
    <FieldErrorRoot>Please enter a valid email.</FieldErrorRoot>
  </TextFieldRoot>
)

describe("TextField", () => {
  it("renders the anatomy with BEM classes and accessibility wiring", () => {
    const { container, getByRole } = render(() => <Anatomy />)
    const root = container.querySelector("[data-slot=textfield]") as HTMLElement
    expect(classSet(root.className)).toEqual(new Set(["textfield"]))

    const input = getByRole("textbox") as HTMLInputElement
    const label = container.querySelector(
      "[data-slot=label]"
    ) as HTMLLabelElement
    const description = container.querySelector(
      "[data-slot=description]"
    ) as HTMLElement
    expect(classSet(input.className)).toEqual(
      new Set(["input", "input--primary"])
    )
    expect(classSet(label.className)).toEqual(new Set(["label"]))
    expect(classSet(description.className)).toEqual(new Set(["description"]))
    expect(label.htmlFor).toBe(input.id)
    expect(input.getAttribute("aria-describedby")).toBe(description.id)
  })

  it("does not render the field error while valid", () => {
    const { container } = render(() => <Anatomy />)
    expect(container.querySelector("[data-slot=field-error]")).toBeNull()
  })

  it("stamps explicit data attributes and shows the error when invalid", () => {
    const { container, getByRole } = render(() => <Anatomy isInvalid />)
    const root = container.querySelector("[data-slot=textfield]") as HTMLElement
    expect(root.getAttribute("data-invalid")).toBe("true")

    const error = container.querySelector(
      "[data-slot=field-error]"
    ) as HTMLElement
    expect(classSet(error.className)).toEqual(new Set(["field-error"]))
    expect(error.hasAttribute("data-visible")).toBe(true)
    expect(getByRole("textbox").getAttribute("aria-invalid")).toBe("true")
    expect(getByRole("textbox").hasAttribute("data-invalid")).toBe(true)
  })

  it("maps isDisabled, isReadOnly and isRequired to the input", () => {
    const { container, getByRole } = render(() => (
      <Anatomy isDisabled isReadOnly isRequired />
    ))
    const root = container.querySelector("[data-slot=textfield]") as HTMLElement
    expect(root.getAttribute("data-disabled")).toBe("true")
    expect(root.getAttribute("data-required")).toBe("true")
    expect(root.getAttribute("data-readonly")).toBe("true")

    const input = getByRole("textbox") as HTMLInputElement
    expect(input.disabled).toBe(true)
    expect(input.readOnly).toBe(true)
    expect(input.required).toBe(true)
  })

  it("passes the field variant down to the input via context", () => {
    const { getByRole } = render(() => (
      <TextFieldRoot variant="secondary">
        <InputRoot />
      </TextFieldRoot>
    ))
    expect(getByRole("textbox").classList.contains("input--secondary")).toBe(
      true
    )
  })

  it("applies fullWidth to the root", () => {
    const { container } = render(() => <Anatomy fullWidth />)
    const root = container.querySelector("[data-slot=textfield]") as HTMLElement
    expect(root.classList.contains("textfield--full-width")).toBe(true)
  })

  it("controls the value and reports changes", () => {
    const onChange = vi.fn()
    const { getByRole } = render(() => (
      <TextFieldRoot defaultValue="hero" onChange={onChange}>
        <InputRoot />
      </TextFieldRoot>
    ))
    const input = getByRole("textbox") as HTMLInputElement
    expect(input.value).toBe("hero")
    fireEvent.input(input, { target: { value: "heroui" } })
    expect(onChange).toHaveBeenCalledWith("heroui")
  })

  it("styles a textarea through the same field", () => {
    const { getByRole } = render(() => (
      <TextFieldRoot variant="secondary">
        <TextAreaRoot />
      </TextFieldRoot>
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(classSet(textarea.className)).toEqual(
      new Set(["textarea", "textarea--secondary"])
    )
    expect(textarea.getAttribute("data-slot")).toBe("textarea")
  })
})
