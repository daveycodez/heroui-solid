// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@solidjs/testing-library"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LabelRoot } from "../label/label"
import {
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownTrigger
} from "./dropdown"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

const Anatomy = (
  props: Parameters<typeof DropdownRoot>[0] & {
    onAction?: (key: string) => void
    disabledKeys?: string[]
  }
) => (
  <DropdownRoot
    defaultOpen={props.defaultOpen}
    isOpen={props.isOpen}
    onOpenChange={props.onOpenChange}
  >
    <DropdownTrigger aria-label="Menu">Actions</DropdownTrigger>
    <DropdownPopover>
      <DropdownMenu disabledKeys={props.disabledKeys} onAction={props.onAction}>
        <DropdownItem id="new-file" textValue="New file">
          <LabelRoot>New file</LabelRoot>
        </DropdownItem>
        <DropdownItem id="copy-link" textValue="Copy link">
          <LabelRoot>Copy link</LabelRoot>
        </DropdownItem>
        <DropdownItem id="delete-file" textValue="Delete file" variant="danger">
          <LabelRoot>Delete file</LabelRoot>
        </DropdownItem>
      </DropdownMenu>
    </DropdownPopover>
  </DropdownRoot>
)

describe("Dropdown", () => {
  // The popover renders into document.body via a portal, so dispose each
  // render to keep document-level queries from hitting stale content.
  afterEach(cleanup)

  it("renders a button trigger with BEM classes and stays closed", () => {
    const { container } = render(() => <Anatomy />)
    const trigger = container.querySelector(
      "[data-slot=dropdown-trigger]"
    ) as HTMLElement
    expect(trigger.tagName).toBe("BUTTON")
    expect(classSet(trigger.className)).toEqual(new Set(["dropdown__trigger"]))
    expect(document.querySelector("[data-slot=dropdown-popover]")).toBeNull()
  })

  it("opens on trigger keyboard activation and renders the menu", () => {
    const { container } = render(() => <Anatomy />)
    const trigger = container.querySelector(
      "[data-slot=dropdown-trigger]"
    ) as HTMLElement
    fireEvent.keyDown(trigger, { key: "Enter" })

    const popover = document.querySelector(
      "[data-slot=dropdown-popover]"
    ) as HTMLElement
    expect(popover).not.toBeNull()
    expect(classSet(popover.className)).toEqual(new Set(["dropdown__popover"]))
    expect(popover.getAttribute("role")).toBe("menu")

    const menu = popover.querySelector(
      "[data-slot=dropdown-menu]"
    ) as HTMLElement
    expect(classSet(menu.className)).toEqual(new Set(["dropdown__menu"]))

    const items = popover.querySelectorAll("[data-slot=menu-item]")
    expect(items.length).toBe(3)
    const first = items[0] as HTMLElement
    expect(first.getAttribute("role")).toBe("menuitem")
    expect(classSet(first.className)).toEqual(
      new Set(["menu-item", "menu-item--default"])
    )
    const label = first.querySelector("[data-slot=label]") as HTMLElement
    expect(label.textContent).toBe("New file")
  })

  it("applies the danger variant to items", () => {
    const { container } = render(() => <Anatomy defaultOpen />)
    expect(container).toBeTruthy()
    const items = Array.from(
      document.querySelectorAll("[data-slot=menu-item]")
    ) as HTMLElement[]
    const danger = items.find((item) =>
      item.textContent?.includes("Delete file")
    )
    expect(danger?.classList.contains("menu-item--danger")).toBe(true)
  })

  it("fires the menu-level onAction with the item key", () => {
    const onAction = vi.fn()
    const { container } = render(() => <Anatomy onAction={onAction} />)
    const trigger = container.querySelector(
      "[data-slot=dropdown-trigger]"
    ) as HTMLElement
    fireEvent.keyDown(trigger, { key: "Enter" })

    // Kobalte items handle their own keyboard activation.
    const items = Array.from(
      document.querySelectorAll("[data-slot=menu-item]")
    ) as HTMLElement[]
    const copyLink = items.find((item) =>
      item.textContent?.includes("Copy link")
    ) as HTMLElement
    fireEvent.keyDown(copyLink, { key: "Enter" })

    expect(onAction).toHaveBeenCalledWith("copy-link")
  })

  it("disables items listed in disabledKeys", () => {
    const { container } = render(() => (
      <Anatomy defaultOpen disabledKeys={["delete-file"]} />
    ))
    expect(container).toBeTruthy()
    const items = Array.from(
      document.querySelectorAll("[data-slot=menu-item]")
    ) as HTMLElement[]
    const danger = items.find((item) =>
      item.textContent?.includes("Delete file")
    ) as HTMLElement
    expect(danger.getAttribute("aria-disabled")).toBe("true")
    expect(danger.hasAttribute("data-disabled")).toBe(true)
  })

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn()
    const { container } = render(() => (
      <Anatomy isOpen onOpenChange={onOpenChange} />
    ))
    expect(container).toBeTruthy()
    expect(
      document.querySelector("[data-slot=dropdown-popover]")
    ).not.toBeNull()
  })
})
