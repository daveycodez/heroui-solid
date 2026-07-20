// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { ButtonRoot } from "../button/button"
import { ButtonGroupRoot, ButtonGroupSeparator } from "./button-group"

// ButtonGroup is a thin skin: a role="group" wrapper that shares slot classes
// and variant/size/disabled with descendant Buttons via context, plus a
// presentational Separator. These guard only what we own.

describe("ButtonGroup (thin skin)", () => {
  it("renders a role=group with the base slot class", () => {
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

  it("applies orientation and fullWidth modifiers", () => {
    const { container } = render(() => (
      <ButtonGroupRoot orientation="vertical" fullWidth>
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

  it("shares variant and size with descendant buttons", () => {
    const { container } = render(() => (
      <ButtonGroupRoot variant="secondary" size="lg">
        <ButtonRoot>First</ButtonRoot>
      </ButtonGroupRoot>
    ))
    const btn = container.querySelector('[data-slot="button"]') as HTMLElement
    expect(btn.className).toContain("button--secondary")
    expect(btn.className).toContain("button--lg")
  })

  it("lets a button override the group's variant", () => {
    const { container } = render(() => (
      <ButtonGroupRoot variant="secondary">
        <ButtonRoot variant="danger">First</ButtonRoot>
      </ButtonGroupRoot>
    ))
    const btn = container.querySelector('[data-slot="button"]') as HTMLElement
    expect(btn.className).toContain("button--danger")
    expect(btn.className).not.toContain("button--secondary")
  })

  it("disables descendant buttons, and a button can opt back in", () => {
    const { container } = render(() => (
      <ButtonGroupRoot disabled>
        <ButtonRoot>Disabled</ButtonRoot>
        <ButtonRoot disabled={false}>Enabled</ButtonRoot>
      </ButtonGroupRoot>
    ))
    const group = container.querySelector(
      '[data-slot="button-group"]'
    ) as HTMLElement
    expect(group.getAttribute("data-disabled")).toBe("true")
    const buttons = container.querySelectorAll<HTMLButtonElement>(
      '[data-slot="button"]'
    )
    expect(buttons[0].disabled).toBe(true)
    expect(buttons[1].disabled).toBe(false)
  })

  it("renders the separator with its slot class and aria-hidden", () => {
    const { container } = render(() => (
      <ButtonGroupRoot>
        <ButtonRoot>
          <ButtonGroupSeparator />
          First
        </ButtonRoot>
      </ButtonGroupRoot>
    ))
    const sep = container.querySelector(
      '[data-slot="button-group-separator"]'
    ) as HTMLElement
    expect(sep.tagName).toBe("SPAN")
    expect(sep.getAttribute("aria-hidden")).toBe("true")
    expect(classSet(sep.className)).toEqual(
      new Set(["button-group__separator"])
    )
  })

  it("supports polymorphic `as` on the separator", () => {
    const { container } = render(() => (
      <ButtonGroupRoot>
        <ButtonRoot>
          <ButtonGroupSeparator as="div" />
          First
        </ButtonRoot>
      </ButtonGroupRoot>
    ))
    const sep = container.querySelector(
      '[data-slot="button-group-separator"]'
    ) as HTMLElement
    expect(sep.tagName).toBe("DIV")
  })
})
