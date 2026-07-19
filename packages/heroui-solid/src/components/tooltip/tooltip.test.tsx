// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger
} from "./tooltip"

const Anatomy = (props: { open?: boolean }) => (
  <TooltipRoot open={props.open}>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipPortal>
      <TooltipContent>
        <TooltipArrow />
        <p>Tooltip text</p>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
)

describe("Tooltip", () => {
  it("renders a button trigger with the trigger slot class", () => {
    const { container } = render(() => <Anatomy />)
    const trigger = container.querySelector(
      "[data-slot=tooltip-trigger]"
    ) as HTMLElement
    expect(trigger.tagName).toBe("BUTTON")
    expect(classSet(trigger.className)).toEqual(new Set(["tooltip__trigger"]))
  })

  it("keeps the content unmounted while closed", () => {
    render(() => <Anatomy />)
    expect(document.querySelector("[data-slot=tooltip]")).toBeNull()
  })

  it("renders portalled content with the base slot class when open", () => {
    render(() => <Anatomy open />)
    const content = document.querySelector("[data-slot=tooltip]") as HTMLElement
    expect(content).not.toBeNull()
    expect(content.classList.contains("tooltip")).toBe(true)
    expect(content.textContent).toContain("Tooltip text")
    expect(content.querySelector("[data-slot=tooltip-arrow]")).not.toBeNull()
  })

  it("bridges the RAC animation attributes onto open content", () => {
    render(() => <Anatomy open />)
    const content = document.querySelector("[data-slot=tooltip]") as HTMLElement
    // Open content is entering, never exiting, and carries a base placement.
    expect(content.getAttribute("data-entering")).toBe("true")
    expect(content.getAttribute("data-exiting")).toBeNull()
    expect(["top", "bottom", "left", "right"]).toContain(
      content.getAttribute("data-placement")
    )
  })

  it("merges a forwarded class onto the content", () => {
    render(() => (
      <TooltipRoot open>
        <TooltipTrigger>t</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent class="custom">c</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    ))
    const content = document.querySelector(
      "[data-slot=tooltip].custom"
    ) as HTMLElement
    expect(content).not.toBeNull()
  })
})
