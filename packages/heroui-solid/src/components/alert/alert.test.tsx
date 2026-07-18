// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import {
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from "./alert"

const Anatomy = (props: {
  status?: "default" | "accent" | "success" | "warning" | "danger"
}) => (
  <AlertRoot class="custom" status={props.status}>
    <AlertIndicator />
    <AlertContent>
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Description</AlertDescription>
    </AlertContent>
  </AlertRoot>
)

describe("Alert", () => {
  it("renders the full anatomy with slot classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)
    const alert = container.querySelector(
      "[data-slot=alert-root]"
    ) as HTMLElement
    expect(alert.tagName).toBe("DIV")
    expect(classSet(alert.className)).toEqual(
      new Set(["alert", "alert--default", "custom"])
    )

    const parts: Array<[string, string, string]> = [
      ["alert-indicator", "alert__indicator", "DIV"],
      ["alert-content", "alert__content", "DIV"],
      ["alert-title", "alert__title", "P"],
      ["alert-description", "alert__description", "SPAN"]
    ]
    for (const [slot, className, tagName] of parts) {
      const el = container.querySelector(`[data-slot=${slot}]`) as HTMLElement
      expect(el.tagName).toBe(tagName)
      expect(classSet(el.className)).toEqual(new Set([className]))
    }
  })

  it("renders a default status icon in the indicator", () => {
    const { container } = render(() => <Anatomy />)
    const icon = container.querySelector('[data-slot="alert-default-icon"]')
    expect(icon?.tagName).toBe("svg")
    expect(icon?.getAttribute("aria-hidden")).toBe("true")
    // Icons are erased from the accessibility tree — no name leaks (AGENTS.md).
    expect(icon?.getAttribute("aria-label")).toBeNull()
  })

  it("applies the status modifier on the root only", () => {
    const { container } = render(() => <Anatomy status="danger" />)
    const alert = container.querySelector(
      "[data-slot=alert-root]"
    ) as HTMLElement
    expect(alert.classList.contains("alert--danger")).toBe(true)
    const content = container.querySelector(
      "[data-slot=alert-content]"
    ) as HTMLElement
    expect(classSet(content.className)).toEqual(new Set(["alert__content"]))
  })

  it("lets a custom indicator override the default icon", () => {
    const { container } = render(() => (
      <AlertRoot status="accent">
        <AlertIndicator>
          <span data-slot="custom-indicator">!</span>
        </AlertIndicator>
      </AlertRoot>
    ))
    expect(
      container.querySelector('[data-slot="alert-default-icon"]')
    ).toBeNull()
    expect(
      container.querySelector('[data-slot="custom-indicator"]')
    ).not.toBeNull()
  })

  it("merges caller classes after slot classes", () => {
    const { container } = render(() => (
      <AlertRoot>
        <AlertContent class="custom-content">Content</AlertContent>
      </AlertRoot>
    ))
    const content = container.querySelector(
      "[data-slot=alert-content]"
    ) as HTMLElement
    expect(classSet(content.className)).toEqual(
      new Set(["alert__content", "custom-content"])
    )
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => (
      <AlertRoot as="section">
        <AlertTitle as="h3">Title</AlertTitle>
      </AlertRoot>
    ))
    expect(
      (container.querySelector("[data-slot=alert-root]") as HTMLElement).tagName
    ).toBe("SECTION")
    expect(
      (container.querySelector("[data-slot=alert-title]") as HTMLElement)
        .tagName
    ).toBe("H3")
  })
})
