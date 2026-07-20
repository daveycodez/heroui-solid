// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import {
  DropdownCheckboxItem,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownRoot,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger
} from "./dropdown"

// Behavior (open/close, keyboard, focus, collection, selection, aria) is
// Kobalte's DropdownMenu and is not retested here. These guard only the thin
// skin we own: the Button-defaulted trigger, slot classes, data-slot hooks,
// the menu-item variant modifier, the forceMount indicator, and class merging.

const bySlot = (slot: string) =>
  document.querySelector(`[data-slot="${slot}"]`) as HTMLElement | null

const Anatomy = (props: { open?: boolean }) => (
  <DropdownRoot open={props.open}>
    <DropdownTrigger>Actions</DropdownTrigger>
    <DropdownPortal>
      <DropdownPopover>
        <DropdownMenu>
          <DropdownItem class="item-custom">New file</DropdownItem>
          <DropdownItem variant="danger">Delete file</DropdownItem>
        </DropdownMenu>
      </DropdownPopover>
    </DropdownPortal>
  </DropdownRoot>
)

describe("Dropdown (thin skin)", () => {
  it("defaults the trigger to a HeroUI Button with the trigger slot", () => {
    render(() => <Anatomy />)
    const trigger = bySlot("dropdown-trigger")
    expect(trigger).not.toBeNull()
    expect(trigger?.tagName).toBe("BUTTON")
    expect(classSet(trigger?.className ?? "").has("dropdown__trigger")).toBe(
      true
    )
  })

  it("lets an explicit `as` override the default Button trigger", () => {
    render(() => (
      <DropdownRoot>
        <DropdownTrigger as="span">Actions</DropdownTrigger>
      </DropdownRoot>
    ))
    expect(bySlot("dropdown-trigger")?.tagName).toBe("SPAN")
  })

  it("keeps the popover unmounted while closed", () => {
    render(() => <Anatomy />)
    expect(bySlot("dropdown-popover")).toBeNull()
  })

  it("renders the portalled popover/menu/items with their slot classes when open", () => {
    render(() => <Anatomy open />)

    const popover = bySlot("dropdown-popover")
    expect(popover).not.toBeNull()
    expect(classSet(popover?.className ?? "").has("dropdown__popover")).toBe(
      true
    )

    const menu = bySlot("dropdown-menu")
    expect(menu).not.toBeNull()
    // role=menu lives on Kobalte's Content; this padded list stays presentational.
    expect(menu?.getAttribute("role")).toBe("presentation")
    expect(classSet(menu?.className ?? "").has("dropdown__menu")).toBe(true)

    const item = bySlot("menu-item")
    expect(item).not.toBeNull()
    expect(classSet(item?.className ?? "").has("menu-item")).toBe(true)
  })

  it("adds the danger modifier only to the danger item", () => {
    render(() => <Anatomy open />)
    const items = document.querySelectorAll("[data-slot=menu-item]")
    expect(classSet(items[0].className).has("menu-item--danger")).toBe(false)
    expect(classSet(items[0].className).has("menu-item--default")).toBe(true)
    expect(classSet(items[1].className).has("menu-item--danger")).toBe(true)
  })

  it("merges a forwarded class after the item slot class", () => {
    render(() => <Anatomy open />)
    expect(classSet(bySlot("menu-item")?.className ?? "")).toEqual(
      new Set(["menu-item", "menu-item--default", "item-custom"])
    )
  })

  it("renders a group with the section slot and a Header-defaulted label", () => {
    render(() => (
      <DropdownRoot open>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownPortal>
          <DropdownPopover>
            <DropdownMenu>
              <DropdownGroup>
                <DropdownGroupLabel>Actions</DropdownGroupLabel>
                <DropdownItem>New file</DropdownItem>
              </DropdownGroup>
            </DropdownMenu>
          </DropdownPopover>
        </DropdownPortal>
      </DropdownRoot>
    ))

    const group = bySlot("menu-section")
    expect(group).not.toBeNull()
    expect(classSet(group?.className ?? "").has("menu-section")).toBe(true)
    // GroupLabel defaults to rendering as our Header (a <header data-slot=header>).
    const label = bySlot("header")
    expect(label?.tagName).toBe("HEADER")
    expect(label?.textContent).toContain("Actions")
  })

  it("force-mounts a default checkmark indicator inside a radio item", () => {
    render(() => (
      <DropdownRoot open>
        <DropdownTrigger>Fruit</DropdownTrigger>
        <DropdownPortal>
          <DropdownPopover>
            <DropdownMenu>
              <DropdownRadioGroup value="apple">
                <DropdownRadioItem value="apple">
                  <DropdownItemIndicator />
                  Apple
                </DropdownRadioItem>
                <DropdownRadioItem value="banana">
                  {/* unchecked, but forceMount keeps the gutter reserved */}
                  <DropdownItemIndicator />
                  Banana
                </DropdownRadioItem>
              </DropdownRadioGroup>
            </DropdownMenu>
          </DropdownPopover>
        </DropdownPortal>
      </DropdownRoot>
    ))

    const indicators = document.querySelectorAll(
      "[data-slot=menu-item-indicator]"
    )
    // forceMount → both the checked and unchecked items carry an indicator.
    expect(indicators.length).toBe(2)
    for (const indicator of indicators) {
      expect(indicator.getAttribute("data-type")).toBe("checkmark")
      expect(
        indicator.querySelector("[data-slot='menu-item-indicator--checkmark']")
      ).not.toBeNull()
      expect(classSet(indicator.className).has("menu-item__indicator")).toBe(
        true
      )
    }
  })

  it("renders the dot indicator variant when type=dot", () => {
    render(() => (
      <DropdownRoot open>
        <DropdownTrigger>Toggle</DropdownTrigger>
        <DropdownPortal>
          <DropdownPopover>
            <DropdownMenu>
              <DropdownCheckboxItem checked>
                <DropdownItemIndicator type="dot" />
                Wifi
              </DropdownCheckboxItem>
            </DropdownMenu>
          </DropdownPopover>
        </DropdownPortal>
      </DropdownRoot>
    ))

    const indicator = bySlot("menu-item-indicator")
    expect(indicator?.getAttribute("data-type")).toBe("dot")
    expect(
      indicator?.querySelector("[data-slot='menu-item-indicator--dot']")
    ).not.toBeNull()
  })

  it("stamps data-has-submenu on the sub-trigger and reuses the popover slot for sub content", () => {
    render(() => (
      <DropdownRoot open>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownPortal>
          <DropdownPopover>
            <DropdownMenu>
              <DropdownSub open>
                <DropdownSubTrigger>More</DropdownSubTrigger>
                <DropdownPortal>
                  <DropdownSubContent>
                    <DropdownItem>Nested</DropdownItem>
                  </DropdownSubContent>
                </DropdownPortal>
              </DropdownSub>
            </DropdownMenu>
          </DropdownPopover>
        </DropdownPortal>
      </DropdownRoot>
    ))

    const subTrigger = document.querySelector(
      "[data-has-submenu=true]"
    ) as HTMLElement | null
    expect(subTrigger).not.toBeNull()
    expect(classSet(subTrigger?.className ?? "").has("menu-item")).toBe(true)

    // Two popovers now: the root Popover and the open SubContent, both reusing
    // the shared popover slot class.
    const popovers = document.querySelectorAll("[data-slot=dropdown-popover]")
    expect(popovers.length).toBe(2)
    for (const popover of popovers) {
      expect(classSet(popover.className).has("dropdown__popover")).toBe(true)
    }
  })
})
