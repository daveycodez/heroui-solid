// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { FormRoot } from "./form"

describe("Form", () => {
  it("renders a native form element and forwards attributes", () => {
    const { container } = render(() => (
      <FormRoot class="my-form" method="post">
        <button type="submit">Go</button>
      </FormRoot>
    ))

    const form = container.querySelector("form") as HTMLFormElement
    expect(form).not.toBeNull()
    expect(form.getAttribute("method")).toBe("post")
    expect(form.classList.contains("my-form")).toBe(true)
    expect(form.querySelector("button")?.textContent).toBe("Go")
  })

  it("fires onSubmit", () => {
    let submitted = false
    const { container } = render(() => (
      <FormRoot
        onSubmit={(e) => {
          e.preventDefault()
          submitted = true
        }}
      >
        <button type="submit">Go</button>
      </FormRoot>
    ))

    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
    expect(submitted).toBe(true)
  })
})
