// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { ButtonRoot } from "./button"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("Button", () => {
  it("renders a native button with BEM classes, data-slot and caller class last", () => {
    const { getByRole } = render(() => (
      <ButtonRoot variant="ghost" size="lg" class="custom">
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.tagName).toBe("BUTTON")
    expect(button.getAttribute("type")).toBe("button")
    expect(button.getAttribute("data-slot")).toBe("button")
    expect(classSet(button.className)).toEqual(
      new Set(["button", "button--ghost", "button--lg", "custom"])
    )
  })

  it("maps isDisabled to the native disabled attribute", () => {
    const { getByRole } = render(() => <ButtonRoot isDisabled>Hi</ButtonRoot>)
    expect((getByRole("button") as HTMLButtonElement).disabled).toBe(true)
  })

  it("stamps pending state and swallows clicks while pending", () => {
    const onClick = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot isPending onClick={onClick}>
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.getAttribute("data-pending")).toBe("true")
    expect(button.getAttribute("aria-disabled")).toBe("true")
    button.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it("invokes onClick when not pending", () => {
    const onClick = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot onClick={onClick}>Hi</ButtonRoot>
    ))
    getByRole("button").click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("supports render-prop children receiving { isPending }", () => {
    const { getByRole } = render(() => (
      <ButtonRoot isPending>
        {(state) => <span>{state.isPending ? "Loading" : "Idle"}</span>}
      </ButtonRoot>
    ))
    expect(getByRole("button").textContent).toBe("Loading")
  })

  it("forwards native button attributes", () => {
    const { getByRole } = render(() => (
      <ButtonRoot type="submit" name="save">
        Save
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.getAttribute("type")).toBe("submit")
    expect(button.getAttribute("name")).toBe("save")
  })

  it("is polymorphic via as, without leaking type onto non-buttons", () => {
    const { getByText } = render(() => (
      <ButtonRoot as="a" href="https://example.com">
        Link
      </ButtonRoot>
    ))
    const link = getByText("Link")
    expect(link.tagName).toBe("A")
    expect(link.getAttribute("href")).toBe("https://example.com")
    expect(link.classList.contains("button")).toBe(true)
    expect(link.classList.contains("button--primary")).toBe(true)
    expect(link.classList.contains("button--md")).toBe(true)
    expect(link.hasAttribute("type")).toBe(false)
  })
})
