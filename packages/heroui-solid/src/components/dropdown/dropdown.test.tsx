// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { afterEach, describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { ButtonRoot } from "../button/button"
import { LabelRoot } from "../label/label"
import {
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger
} from "./dropdown"

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

  it("stamps data-placement for the default bottom placement", () => {
    render(() => <Anatomy defaultOpen />)
    const popover = document.querySelector(
      "[data-slot=dropdown-popover]"
    ) as HTMLElement
    expect(popover.getAttribute("data-placement")).toBe("bottom")
  })

  it("stamps the placement side requested on the popover", () => {
    render(() => (
      <DropdownRoot defaultOpen>
        <DropdownTrigger aria-label="Menu">Actions</DropdownTrigger>
        <DropdownPopover placement="top-start">
          <DropdownMenu>
            <DropdownItem id="new-file" textValue="New file">
              <LabelRoot>New file</LabelRoot>
            </DropdownItem>
          </DropdownMenu>
        </DropdownPopover>
      </DropdownRoot>
    ))
    const popover = document.querySelector(
      "[data-slot=dropdown-popover]"
    ) as HTMLElement
    expect(popover.getAttribute("data-placement")).toBe("top")
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

const itemByText = (text: string) =>
  (
    Array.from(
      document.querySelectorAll("[data-slot=menu-item]")
    ) as HTMLElement[]
  ).find((item) => item.textContent?.includes(text)) as HTMLElement

describe("Dropdown selection", () => {
  const SingleSelection = (props: {
    onSelectionChange?: (keys: "all" | Set<string>) => void
  }) => (
    <DropdownRoot defaultOpen>
      <DropdownTrigger aria-label="Menu">Fruit</DropdownTrigger>
      <DropdownPopover>
        <DropdownMenu
          defaultSelectedKeys={new Set(["apple"])}
          selectionMode="single"
          onSelectionChange={props.onSelectionChange}
        >
          <DropdownItem id="apple" textValue="Apple">
            <DropdownItemIndicator />
            <LabelRoot>Apple</LabelRoot>
          </DropdownItem>
          <DropdownItem id="banana" textValue="Banana">
            <DropdownItemIndicator />
            <LabelRoot>Banana</LabelRoot>
          </DropdownItem>
        </DropdownMenu>
      </DropdownPopover>
    </DropdownRoot>
  )

  it("renders single-selection items as menuitemradio with selection attributes", () => {
    render(() => <SingleSelection />)
    const apple = itemByText("Apple")
    expect(apple.getAttribute("role")).toBe("menuitemradio")
    expect(apple.getAttribute("aria-checked")).toBe("true")
    expect(apple.getAttribute("data-selected")).toBe("true")
    expect(apple.getAttribute("data-selection-mode")).toBe("single")
    const banana = itemByText("Banana")
    expect(banana.getAttribute("aria-checked")).toBe("false")
    expect(banana.hasAttribute("data-selected")).toBe(false)
  })

  it("moves single selection on activation and fires onSelectionChange", () => {
    const onSelectionChange = vi.fn()
    render(() => <SingleSelection onSelectionChange={onSelectionChange} />)
    fireEvent.keyDown(itemByText("Banana"), { key: "Enter" })
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["banana"]))
    expect(itemByText("Banana").getAttribute("aria-checked")).toBe("true")
    expect(itemByText("Apple").getAttribute("aria-checked")).toBe("false")
  })

  it("toggles multiple selection and keeps the menu open", async () => {
    const onSelectionChange = vi.fn()
    render(() => (
      <DropdownRoot defaultOpen>
        <DropdownTrigger aria-label="Menu">Format</DropdownTrigger>
        <DropdownPopover>
          <DropdownMenu
            defaultSelectedKeys={new Set(["bold"])}
            selectionMode="multiple"
            onSelectionChange={onSelectionChange}
          >
            <DropdownItem id="bold" textValue="Bold">
              <LabelRoot>Bold</LabelRoot>
              <DropdownItemIndicator />
            </DropdownItem>
            <DropdownItem id="italic" textValue="Italic">
              <LabelRoot>Italic</LabelRoot>
              <DropdownItemIndicator />
            </DropdownItem>
          </DropdownMenu>
        </DropdownPopover>
      </DropdownRoot>
    ))
    const bold = itemByText("Bold")
    expect(bold.getAttribute("role")).toBe("menuitemcheckbox")
    fireEvent.keyDown(itemByText("Italic"), { key: "Enter" })
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set(["bold", "italic"])
    )
    fireEvent.keyDown(bold, { key: "Enter" })
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["italic"]))
    // Kobalte closes on a 1ms timeout; give it a chance to (not) fire.
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(
      document.querySelector("[data-slot=dropdown-popover]")
    ).not.toBeNull()
  })

  it("scopes section-level selection to the section", () => {
    const onSelectionChange = vi.fn()
    render(() => (
      <DropdownRoot defaultOpen>
        <DropdownTrigger aria-label="Menu">Styles</DropdownTrigger>
        <DropdownPopover>
          <DropdownMenu>
            <DropdownItem id="cut" textValue="Cut">
              <LabelRoot>Cut</LabelRoot>
            </DropdownItem>
            <DropdownSection
              defaultSelectedKeys={new Set(["bold"])}
              selectionMode="multiple"
              onSelectionChange={onSelectionChange}
            >
              <DropdownItem id="bold" textValue="Bold">
                <DropdownItemIndicator />
                <LabelRoot>Bold</LabelRoot>
              </DropdownItem>
              <DropdownItem id="italic" textValue="Italic">
                <DropdownItemIndicator />
                <LabelRoot>Italic</LabelRoot>
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </DropdownPopover>
      </DropdownRoot>
    ))
    expect(itemByText("Cut").getAttribute("role")).toBe("menuitem")
    expect(itemByText("Cut").hasAttribute("aria-checked")).toBe(false)
    const bold = itemByText("Bold")
    expect(bold.getAttribute("role")).toBe("menuitemcheckbox")
    expect(bold.getAttribute("aria-checked")).toBe("true")
    fireEvent.keyDown(itemByText("Italic"), { key: "Enter" })
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["bold", "italic"]))
  })

  it("renders the item indicator with default checkmark and custom render function", () => {
    render(() => (
      <DropdownRoot defaultOpen>
        <DropdownTrigger aria-label="Menu">Fruit</DropdownTrigger>
        <DropdownPopover>
          <DropdownMenu
            defaultSelectedKeys={new Set(["apple"])}
            selectionMode="single"
          >
            <DropdownItem id="apple" textValue="Apple">
              <DropdownItemIndicator />
              <LabelRoot>Apple</LabelRoot>
            </DropdownItem>
            <DropdownItem id="banana" textValue="Banana">
              <DropdownItemIndicator type="dot" />
              <LabelRoot>Banana</LabelRoot>
            </DropdownItem>
            <DropdownItem id="cherry" textValue="Cherry">
              <DropdownItemIndicator>
                {(state) =>
                  state.isSelected ? <span>on</span> : <span>off</span>
                }
              </DropdownItemIndicator>
              <LabelRoot>Cherry</LabelRoot>
            </DropdownItem>
          </DropdownMenu>
        </DropdownPopover>
      </DropdownRoot>
    ))
    const appleIndicator = itemByText("Apple").querySelector(
      "[data-slot=menu-item-indicator]"
    ) as HTMLElement
    expect(classSet(appleIndicator.className)).toEqual(
      new Set(["menu-item__indicator"])
    )
    expect(appleIndicator.getAttribute("data-type")).toBe("checkmark")
    expect(appleIndicator.getAttribute("data-visible")).toBe("true")
    expect(
      appleIndicator.querySelector(
        "[data-slot='menu-item-indicator--checkmark']"
      )
    ).not.toBeNull()
    const bananaIndicator = itemByText("Banana").querySelector(
      "[data-slot=menu-item-indicator]"
    ) as HTMLElement
    expect(bananaIndicator.getAttribute("data-type")).toBe("dot")
    expect(bananaIndicator.hasAttribute("data-visible")).toBe(false)
    expect(
      bananaIndicator.querySelector("[data-slot='menu-item-indicator--dot']")
    ).not.toBeNull()
    const cherryIndicator = itemByText("Cherry").querySelector(
      "[data-slot=menu-item-indicator]"
    ) as HTMLElement
    expect(cherryIndicator.textContent).toBe("off")
    fireEvent.keyDown(itemByText("Cherry"), { key: "Enter" })
    expect(cherryIndicator.textContent).toBe("on")
  })
})

describe("Dropdown submenus", () => {
  const Submenus = () => (
    <DropdownRoot defaultOpen>
      <DropdownTrigger aria-label="Menu">Share</DropdownTrigger>
      <DropdownPopover>
        <DropdownMenu>
          <DropdownItem id="copy-link" textValue="Copy Link">
            <LabelRoot>Copy Link</LabelRoot>
          </DropdownItem>
          <DropdownSubmenuTrigger>
            <DropdownItem id="share" textValue="Share">
              <LabelRoot>Other</LabelRoot>
              <DropdownSubmenuIndicator />
            </DropdownItem>
            <DropdownPopover>
              <DropdownMenu>
                <DropdownItem id="whatsapp" textValue="WhatsApp">
                  <LabelRoot>WhatsApp</LabelRoot>
                </DropdownItem>
              </DropdownMenu>
            </DropdownPopover>
          </DropdownSubmenuTrigger>
        </DropdownMenu>
      </DropdownPopover>
    </DropdownRoot>
  )

  it("renders the submenu trigger item with indicator and closed submenu", () => {
    render(() => <Submenus />)
    const trigger = itemByText("Other")
    expect(trigger.getAttribute("role")).toBe("menuitem")
    expect(trigger.getAttribute("aria-haspopup")).toBe("true")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(trigger.getAttribute("data-has-submenu")).toBe("true")
    expect(classSet(trigger.className)).toEqual(
      new Set(["menu-item", "menu-item--default"])
    )
    const indicator = trigger.querySelector(
      "[data-slot=submenu-indicator]"
    ) as HTMLElement
    expect(classSet(indicator.className)).toEqual(
      new Set(["menu-item__indicator", "menu-item__indicator--submenu"])
    )
    expect(indicator.querySelector("svg")).not.toBeNull()
    expect(itemByText("WhatsApp")).toBeUndefined()
  })

  it("opens the submenu from the trigger item", () => {
    render(() => <Submenus />)
    const trigger = itemByText("Other")
    fireEvent.keyDown(trigger, { key: "ArrowRight" })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    const submenuItem = itemByText("WhatsApp")
    expect(submenuItem).not.toBeUndefined()
    const popovers = document.querySelectorAll("[data-slot=dropdown-popover]")
    expect(popovers.length).toBe(2)
    expect(popovers[1]?.getAttribute("data-placement")).toBe("right")
  })

  it("plain items render no submenu indicator", () => {
    render(() => <Submenus />)
    expect(
      itemByText("Copy Link").querySelector("[data-slot=submenu-indicator]")
    ).toBeNull()
  })
})

describe("Dropdown long-press trigger", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  const LongPress = (props: { useButton?: boolean }) => (
    <DropdownRoot trigger="longPress">
      {props.useButton ? (
        <ButtonRoot aria-label="Menu">Long Press</ButtonRoot>
      ) : (
        <DropdownTrigger aria-label="Menu">Long Press</DropdownTrigger>
      )}
      <DropdownPopover>
        <DropdownMenu>
          <DropdownItem id="new-file" textValue="New file">
            <LabelRoot>New file</LabelRoot>
          </DropdownItem>
        </DropdownMenu>
      </DropdownPopover>
    </DropdownRoot>
  )

  const trigger = () =>
    document.querySelector("[aria-label=Menu]") as HTMLElement
  const popover = () => document.querySelector("[data-slot=dropdown-popover]")

  it("does not open on press, opens after the long-press threshold", () => {
    vi.useFakeTimers()
    render(() => <LongPress />)
    fireEvent.pointerDown(trigger(), { button: 0 })
    expect(popover()).toBeNull()
    vi.advanceTimersByTime(600)
    expect(popover()).not.toBeNull()
  })

  it("cancels the long press when the pointer is released early", () => {
    vi.useFakeTimers()
    render(() => <LongPress />)
    fireEvent.pointerDown(trigger(), { button: 0 })
    vi.advanceTimersByTime(200)
    fireEvent.pointerUp(trigger(), { button: 0 })
    fireEvent.click(trigger(), { button: 0 })
    vi.advanceTimersByTime(600)
    expect(popover()).toBeNull()
  })

  it("ignores Enter but opens on Alt+ArrowDown", () => {
    render(() => <LongPress />)
    fireEvent.keyDown(trigger(), { key: "Enter" })
    expect(popover()).toBeNull()
    fireEvent.keyDown(trigger(), { key: "ArrowDown", altKey: true })
    expect(popover()).not.toBeNull()
  })

  it("supports a Button rendered as the long-press trigger", () => {
    vi.useFakeTimers()
    render(() => <LongPress useButton />)
    fireEvent.pointerDown(trigger(), { button: 0 })
    expect(popover()).toBeNull()
    vi.advanceTimersByTime(600)
    expect(popover()).not.toBeNull()
  })
})
