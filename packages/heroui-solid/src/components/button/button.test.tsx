// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { createSignal, type JSX } from "solid-js"
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

  it("invokes the render prop exactly once; isPending toggles update in place", () => {
    const renderProp = vi.fn((state: { isPending: boolean }) => (
      <>
        <span data-testid="static">Static</span>
        <span data-testid="dynamic">
          {state.isPending ? "Loading" : "Idle"}
        </span>
      </>
    ))
    const [pending, setPending] = createSignal(false)
    const { getByTestId } = render(() => (
      <ButtonRoot isPending={pending()}>{renderProp}</ButtonRoot>
    ))
    const staticEl = getByTestId("static")
    const staticText = staticEl.firstChild
    const dynamicEl = getByTestId("dynamic")
    expect(renderProp).toHaveBeenCalledTimes(1)
    expect(dynamicEl.textContent).toBe("Idle")

    setPending(true)
    expect(renderProp).toHaveBeenCalledTimes(1)
    expect(getByTestId("static")).toBe(staticEl)
    expect(getByTestId("static").firstChild).toBe(staticText)
    expect(getByTestId("dynamic")).toBe(dynamicEl)
    expect(dynamicEl.textContent).toBe("Loading")

    setPending(false)
    expect(renderProp).toHaveBeenCalledTimes(1)
    expect(dynamicEl.textContent).toBe("Idle")
  })

  it("shows and hides pending content without recreating siblings", () => {
    const [pending, setPending] = createSignal(false)
    const { getByTestId, queryByTestId } = render(() => (
      <ButtonRoot isPending={pending()}>
        {(state) => (
          <>
            {state.isPending && <span data-testid="spinner" />}
            <span data-testid="label">Upload</span>
          </>
        )}
      </ButtonRoot>
    ))
    const label = getByTestId("label")
    expect(queryByTestId("spinner")).toBeNull()

    setPending(true)
    expect(queryByTestId("spinner")).not.toBeNull()
    expect(getByTestId("label")).toBe(label)

    setPending(false)
    expect(queryByTestId("spinner")).toBeNull()
    expect(getByTestId("label")).toBe(label)
  })

  it("returns the same resolved children when read more than once", () => {
    const renderProp = vi.fn(() => <span data-testid="once">Once</span>)
    // Emulates a polymorphic layer that reads props.children twice; the memo
    // must hand back the same nodes instead of re-invoking the render prop.
    const DoubleRead = (props: { children?: JSX.Element }) => (
      <button type="button">
        {props.children}
        {props.children}
      </button>
    )
    const { getAllByTestId } = render(() => (
      <ButtonRoot as={DoubleRead}>{renderProp}</ButtonRoot>
    ))
    expect(renderProp).toHaveBeenCalledTimes(1)
    expect(getAllByTestId("once")).toHaveLength(1)
  })

  it("swallows pending activation for delegated handlers and native listeners", () => {
    const onClick = vi.fn()
    const native = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot isPending onClick={onClick}>
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    // Added after mount — only stopImmediatePropagation from our earlier
    // at-target listener can silence it.
    button.addEventListener("click", native)
    // Keyboard activation (Enter/Space) synthesizes exactly this native
    // click, so this covers the keyboard path too.
    button.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    )
    expect(onClick).not.toHaveBeenCalled()
    expect(native).not.toHaveBeenCalled()
  })

  it("invokes delegated handler and native listeners when not pending", () => {
    const onClick = vi.fn()
    const native = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot onClick={onClick}>Hi</ButtonRoot>
    ))
    const button = getByRole("button")
    button.addEventListener("click", native)
    button.click()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(native).toHaveBeenCalledTimes(1)
  })

  it("keeps disabled semantics when isDisabled and isPending are both set", () => {
    const onClick = vi.fn()
    const { getByRole } = render(() => (
      <ButtonRoot isDisabled isPending onClick={onClick}>
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button") as HTMLButtonElement
    expect(button.disabled).toBe(true)
    expect(button.getAttribute("aria-disabled")).toBe("true")
    button.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    )
    expect(onClick).not.toHaveBeenCalled()
  })

  it("prevents consumers from desyncing state-derived attributes while active", () => {
    const { getByRole } = render(() => (
      <ButtonRoot isPending aria-disabled="false" data-pending="false">
        Hi
      </ButtonRoot>
    ))
    const button = getByRole("button")
    expect(button.getAttribute("data-pending")).toBe("true")
    expect(button.getAttribute("aria-disabled")).toBe("true")
  })

  it("stamps a polite live region only when the consumer uses isPending", () => {
    const withPending = render(() => (
      <ButtonRoot isPending={false}>Hi</ButtonRoot>
    ))
    expect(withPending.getByRole("button").getAttribute("aria-live")).toBe(
      "polite"
    )
    const withoutPending = render(() => <ButtonRoot>Hi</ButtonRoot>)
    expect(
      withoutPending.getByRole("button").getAttribute("aria-live")
    ).toBeNull()
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
