// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { LinkIcon, LinkRoot } from "./link"

// The behavior (navigation, disabled, aria) is Kobalte's and is not retested
// here. These guard only the thin skin we own: slot classes, data-slot hooks,
// class merging, and the default external-link Icon.

describe("Link (thin skin)", () => {
  it("renders an anchor with slot classes and href", () => {
    const { container } = render(() => (
      <LinkRoot class="custom" href="https://example.com">
        Call to action
      </LinkRoot>
    ))
    const link = container.querySelector(
      "[data-slot=link]"
    ) as HTMLAnchorElement
    expect(link.tagName).toBe("A")
    expect(link.getAttribute("href")).toBe("https://example.com")
    expect(classSet(link.className)).toEqual(new Set(["link", "custom"]))
  })

  it("renders the default external icon when Icon has no children", () => {
    const { container } = render(() => (
      <LinkRoot href="#">
        Docs
        <LinkIcon />
      </LinkRoot>
    ))
    const icon = container.querySelector("[data-slot=link-icon]") as HTMLElement
    expect(icon.tagName).toBe("SPAN")
    expect(classSet(icon.className)).toEqual(new Set(["link__icon"]))
    expect(icon.getAttribute("data-default-icon")).toBe("true")
    expect(icon.querySelector("[data-slot=link-default-icon]")).not.toBeNull()
  })

  it("renders custom icon children without the default marker", () => {
    const { container } = render(() => (
      <LinkRoot href="#">
        Docs
        <LinkIcon class="custom-icon">
          <svg data-testid="custom" />
        </LinkIcon>
      </LinkRoot>
    ))
    const icon = container.querySelector("[data-slot=link-icon]") as HTMLElement
    expect(icon.getAttribute("data-default-icon")).toBeNull()
    expect(icon.querySelector("[data-slot=link-default-icon]")).toBeNull()
    expect(icon.querySelector("[data-testid=custom]")).not.toBeNull()
    expect(classSet(icon.className)).toEqual(
      new Set(["link__icon", "custom-icon"])
    )
  })
})
