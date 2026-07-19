// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { TextAreaRoot } from "./textarea"

describe("TextArea", () => {
  it("renders a plain textarea with BEM classes outside a field", () => {
    const { getByRole } = render(() => <TextAreaRoot class="custom" />)
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea.getAttribute("data-slot")).toBe("textarea")
    expect(classSet(textarea.className)).toEqual(
      new Set(["textarea", "textarea--primary", "custom"])
    )
  })

  it("applies variant and fullWidth modifiers", () => {
    const { getByRole } = render(() => (
      <TextAreaRoot fullWidth variant="secondary" />
    ))
    expect(
      classSet((getByRole("textbox") as HTMLTextAreaElement).className)
    ).toEqual(
      new Set(["textarea", "textarea--secondary", "textarea--full-width"])
    )
  })

  it("marks the fallback textarea non-multiline and submits on Enter", () => {
    let submitted = false
    const { getByRole } = render(() => (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submitted = true
        }}
      >
        <TextAreaRoot submitOnEnter />
      </form>
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    expect(textarea.getAttribute("aria-multiline")).toBe("false")

    textarea.dispatchEvent(
      new KeyboardEvent("keypress", {
        key: "Enter",
        bubbles: true,
        cancelable: true
      })
    )
    expect(submitted).toBe(true)
  })

  it("does not submit on Shift+Enter", () => {
    let submitted = false
    const { getByRole } = render(() => (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          submitted = true
        }}
      >
        <TextAreaRoot submitOnEnter />
      </form>
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    textarea.dispatchEvent(
      new KeyboardEvent("keypress", {
        key: "Enter",
        shiftKey: true,
        bubbles: true,
        cancelable: true
      })
    )
    expect(submitted).toBe(false)
  })

  it("still calls a caller-provided onKeyPress on the fallback path", () => {
    let called = false
    const { getByRole } = render(() => (
      <TextAreaRoot
        submitOnEnter
        onKeyPress={() => {
          called = true
        }}
      />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    textarea.dispatchEvent(
      new KeyboardEvent("keypress", { key: "a", bubbles: true })
    )
    expect(called).toBe(true)
  })

  it("omits aria-multiline without submitOnEnter", () => {
    const { getByRole } = render(() => <TextAreaRoot />)
    expect(getByRole("textbox").hasAttribute("aria-multiline")).toBe(false)
  })

  it("does not leak autoResize/submitOnEnter as DOM attributes", () => {
    const { getByRole } = render(() => (
      <TextAreaRoot autoResize submitOnEnter />
    ))
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    expect(textarea.hasAttribute("autoresize")).toBe(false)
    expect(textarea.hasAttribute("submitonenter")).toBe(false)
  })

  it("still calls a caller-provided onInput on the fallback path", () => {
    let value = ""
    const { getByRole } = render(() => (
      <TextAreaRoot
        autoResize
        onInput={(event) => {
          value = event.currentTarget.value
        }}
      />
    ))
    fireEvent.input(getByRole("textbox"), { target: { value: "heroui" } })
    expect(value).toBe("heroui")
  })

  it("does not throw on Enter when submitOnEnter has no form", () => {
    const { getByRole } = render(() => <TextAreaRoot submitOnEnter />)
    const textarea = getByRole("textbox") as HTMLTextAreaElement
    expect(() =>
      textarea.dispatchEvent(
        new KeyboardEvent("keypress", {
          key: "Enter",
          bubbles: true,
          cancelable: true
        })
      )
    ).not.toThrow()
  })

  it("forwards a caller ref on the fallback path", () => {
    let el: HTMLTextAreaElement | undefined
    render(() => (
      <TextAreaRoot
        ref={(node) => {
          el = node
        }}
      />
    ))
    expect(el?.tagName).toBe("TEXTAREA")
  })
})
