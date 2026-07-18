// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { ButtonRoot } from "../button/button"
import { ButtonGroupRoot, ButtonGroupSeparator } from "./button-group"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("ButtonGroup", () => {
  it("renders a group container with orientation defaults", () => {
    const { container } = render(() => (
      <ButtonGroupRoot>
        <ButtonRoot>First</ButtonRoot>
      </ButtonGroupRoot>
    ))

    const group = container.querySelector(
      '[data-slot="button-group"]'
    ) as HTMLElement
    expect(group.getAttribute("role")).toBe("group")
    expect(classSet(group.className)).toEqual(
      new Set(["button-group", "button-group--horizontal"])
    )
  })

  it("marks the container full width and vertical", () => {
    const { container } = render(() => (
      <ButtonGroupRoot fullWidth orientation="vertical">
        <ButtonRoot>First</ButtonRoot>
      </ButtonGroupRoot>
    ))

    const group = container.querySelector(
      '[data-slot="button-group"]'
    ) as HTMLElement
    expect(classSet(group.className)).toEqual(
      new Set([
        "button-group",
        "button-group--vertical",
        "button-group--full-width"
      ])
    )
  })

  it("passes variant and size down to child buttons", () => {
    const { container } = render(() => (
      <ButtonGroupRoot size="lg" variant="danger">
        <ButtonRoot>First</ButtonRoot>
      </ButtonGroupRoot>
    ))

    const button = container.querySelector(
      '[data-slot="button"]'
    ) as HTMLElement
    const cls = classSet(button.className)
    expect(cls.has("button--danger")).toBe(true)
    expect(cls.has("button--lg")).toBe(true)
  })

  it("lets a child button override the group's props", () => {
    const { container } = render(() => (
      <ButtonGroupRoot variant="danger">
        <ButtonRoot>Group</ButtonRoot>
        <ButtonRoot variant="secondary">Own</ButtonRoot>
      </ButtonGroupRoot>
    ))

    const buttons = container.querySelectorAll('[data-slot="button"]')
    expect(classSet(buttons[0].className).has("button--danger")).toBe(true)
    expect(classSet(buttons[1].className).has("button--secondary")).toBe(true)
    expect(classSet(buttons[1].className).has("button--danger")).toBe(false)
  })

  it("disables all buttons unless one opts out with isDisabled={false}", () => {
    const { container } = render(() => (
      <ButtonGroupRoot isDisabled>
        <ButtonRoot>Disabled</ButtonRoot>
        <ButtonRoot isDisabled={false}>Enabled</ButtonRoot>
      </ButtonGroupRoot>
    ))

    const buttons = container.querySelectorAll(
      '[data-slot="button"]'
    ) as NodeListOf<HTMLButtonElement>
    expect(buttons[0].disabled).toBe(true)
    expect(buttons[1].disabled).toBe(false)
  })

  it("renders a separator with the group's separator slot class", () => {
    const { container } = render(() => (
      <ButtonGroupRoot>
        <ButtonRoot>
          <ButtonGroupSeparator />
          First
        </ButtonRoot>
      </ButtonGroupRoot>
    ))

    const separator = container.querySelector(
      '[data-slot="button-group-separator"]'
    ) as HTMLElement
    expect(separator.getAttribute("aria-hidden")).toBe("true")
    expect(classSet(separator.className)).toEqual(
      new Set(["button-group__separator"])
    )
  })

  it("leaves a standalone button untouched by group context", () => {
    const { container } = render(() => <ButtonRoot>Solo</ButtonRoot>)

    const button = container.querySelector(
      '[data-slot="button"]'
    ) as HTMLElement
    expect(button.className).toContain("button")
  })
})
