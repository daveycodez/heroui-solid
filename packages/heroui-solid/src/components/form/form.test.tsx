// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { FormRoot } from "./form"

// Form is a thin native <form {...props}> pass-through — the submit event is the
// platform's, not ours. This guards only the thin skin we own: attribute and
// class forwarding onto the element.

describe("Form (thin skin)", () => {
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
})
