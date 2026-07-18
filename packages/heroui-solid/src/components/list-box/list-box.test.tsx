// @vitest-environment jsdom
import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { HeaderRoot } from "../header/header"
import { ListBoxSectionRoot } from "../list-box-section/list-box-section"
import { SeparatorRoot } from "../separator/separator"
import { ListBoxItem, ListBoxItemIndicator, ListBoxRoot } from "./list-box"

const Anatomy = (props: Parameters<typeof ListBoxRoot>[0]) => (
  <ListBoxRoot aria-label="Users" {...props}>
    <ListBoxItem id="bob" textValue="Bob">
      Bob
      <ListBoxItemIndicator />
    </ListBoxItem>
    <ListBoxItem id="fred" textValue="Fred">
      Fred
      <ListBoxItemIndicator />
    </ListBoxItem>
    <ListBoxItem id="martha" textValue="Martha">
      Martha
      <ListBoxItemIndicator />
    </ListBoxItem>
  </ListBoxRoot>
)

describe("ListBox (standalone)", () => {
  it("renders a listbox with items, BEM classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)

    const root = container.querySelector("[data-slot=list-box]") as HTMLElement
    expect(root).not.toBeNull()
    expect(root.getAttribute("role")).toBe("listbox")
    expect(root.className).toContain("list-box")

    const options = container.querySelectorAll("[data-slot=list-box-item]")
    expect(options.length).toBe(3)
    expect(options[0]?.getAttribute("role")).toBe("option")
    expect(options[0]?.className).toContain("list-box-item")
    expect(options[0]?.textContent).toContain("Bob")
  })

  it("selects an item on click and reports the selection", () => {
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <Anatomy onSelectionChange={onSelectionChange} />
    ))

    const fred = container.querySelectorAll(
      "[data-slot=list-box-item]"
    )[1] as HTMLElement
    fireEvent.pointerDown(fred, { pointerId: 1, pointerType: "mouse" })
    fireEvent.click(fred)

    expect(onSelectionChange).toHaveBeenCalledOnce()
    const [keys] = onSelectionChange.mock.calls[0] as [Set<string>]
    expect([...keys]).toEqual(["fred"])
    expect(fred.getAttribute("aria-selected")).toBe("true")
  })

  it("marks defaultSelectedKeys as selected and shows the indicator", () => {
    const { container } = render(() => (
      <Anatomy defaultSelectedKeys={["martha"]} />
    ))

    const martha = container.querySelectorAll(
      "[data-slot=list-box-item]"
    )[2] as HTMLElement
    expect(martha.getAttribute("aria-selected")).toBe("true")
    expect(
      martha.querySelector("[data-slot=list-box-item-indicator--checkmark]")
    ).not.toBeNull()
  })

  it("supports multiple selection", () => {
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <Anatomy
        defaultSelectedKeys={["bob"]}
        onSelectionChange={onSelectionChange}
        selectionMode="multiple"
      />
    ))

    const fred = container.querySelectorAll(
      "[data-slot=list-box-item]"
    )[1] as HTMLElement
    fireEvent.pointerDown(fred, { pointerId: 1, pointerType: "mouse" })
    fireEvent.click(fred)

    expect(onSelectionChange).toHaveBeenCalledOnce()
    const [keys] = onSelectionChange.mock.calls[0] as [Set<string>]
    expect([...keys].sort()).toEqual(["bob", "fred"])
  })

  it("disables items via disabledKeys and isDisabled", () => {
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <ListBoxRoot
        aria-label="Users"
        disabledKeys={["bob"]}
        onSelectionChange={onSelectionChange}
      >
        <ListBoxItem id="bob" textValue="Bob">
          Bob
        </ListBoxItem>
        <ListBoxItem id="fred" isDisabled textValue="Fred">
          Fred
        </ListBoxItem>
      </ListBoxRoot>
    ))

    const options = container.querySelectorAll("[data-slot=list-box-item]")
    for (const option of options) {
      expect(option.getAttribute("aria-disabled")).toBe("true")
      fireEvent.pointerDown(option, { pointerId: 1, pointerType: "mouse" })
      fireEvent.click(option)
    }
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it("supports controlled selection via selectedKeys", () => {
    const { container } = render(() => <Anatomy selectedKeys={["bob"]} />)

    const options = container.querySelectorAll("[data-slot=list-box-item]")
    expect(options[0]?.getAttribute("aria-selected")).toBe("true")

    const fred = options[1] as HTMLElement
    fireEvent.pointerDown(fred, { pointerId: 1, pointerType: "mouse" })
    fireEvent.click(fred)
    expect(fred.getAttribute("aria-selected")).not.toBe("true")
    expect(options[0]?.getAttribute("aria-selected")).toBe("true")
  })
})

const Sectioned = (props: Parameters<typeof ListBoxRoot>[0]) => (
  <ListBoxRoot aria-label="File actions" {...props}>
    <ListBoxSectionRoot class="custom-section">
      <HeaderRoot>Actions</HeaderRoot>
      <ListBoxItem id="new-file" textValue="New file">
        New file
      </ListBoxItem>
      <ListBoxItem id="edit-file" textValue="Edit file">
        Edit file
      </ListBoxItem>
    </ListBoxSectionRoot>
    <SeparatorRoot />
    <ListBoxSectionRoot>
      <HeaderRoot>Danger zone</HeaderRoot>
      <ListBoxItem id="delete-file" textValue="Delete file" variant="danger">
        Delete file
      </ListBoxItem>
    </ListBoxSectionRoot>
  </ListBoxRoot>
)

describe("ListBox sections", () => {
  it("renders sections, headers, and an interleaved separator in order", () => {
    const { container } = render(() => <Sectioned selectionMode="none" />)

    const list = container.querySelector("[data-slot=list-box]") as HTMLElement
    const kinds = [...list.children].map(
      (el) => el.getAttribute("data-slot") ?? el.tagName.toLowerCase()
    )
    expect(kinds).toEqual([
      "list-box-section",
      "list-box-item",
      "list-box-item",
      "separator",
      "list-box-section",
      "list-box-item"
    ])

    const sections = list.querySelectorAll("[data-slot=list-box-section]")
    expect(sections[0]?.getAttribute("role")).toBe("presentation")
    expect(sections[0]?.className).toContain("list-box-section")
    expect(sections[0]?.className).toContain("custom-section")
    expect(sections[0]?.querySelector("[data-slot=header]")?.textContent).toBe(
      "Actions"
    )
    expect(sections[1]?.querySelector("[data-slot=header]")?.textContent).toBe(
      "Danger zone"
    )

    const separator = list.querySelector("[data-slot=separator]")
    expect(separator?.getAttribute("data-orientation")).toBe("horizontal")

    const danger = list.querySelectorAll("[data-slot=list-box-item]")[2]
    expect(danger?.className).toContain("list-box-item--danger")
  })

  it("fires onAction on click, Enter, and Space in selectionMode none", () => {
    const onAction = vi.fn()
    const { container } = render(() => (
      <Sectioned onAction={onAction} selectionMode="none" />
    ))

    const item = container.querySelectorAll(
      "[data-slot=list-box-item]"
    )[0] as HTMLElement
    fireEvent.click(item)
    expect(onAction).toHaveBeenCalledWith("new-file")
    expect(item.getAttribute("aria-selected")).not.toBe("true")

    fireEvent.keyDown(item, { key: "Enter" })
    fireEvent.keyDown(item, { key: " " })
    expect(onAction).toHaveBeenCalledTimes(3)
  })

  it("does not fire onAction for disabled items", () => {
    const onAction = vi.fn()
    const { container } = render(() => (
      <Sectioned
        disabledKeys={["delete-file"]}
        onAction={onAction}
        selectionMode="none"
      />
    ))

    const delete_ = container.querySelectorAll(
      "[data-slot=list-box-item]"
    )[2] as HTMLElement
    expect(delete_.getAttribute("aria-disabled")).toBe("true")
    fireEvent.click(delete_)
    fireEvent.keyDown(delete_, { key: "Enter" })
    expect(onAction).not.toHaveBeenCalled()
  })

  it("fires onAction alongside selection in single mode", () => {
    const onAction = vi.fn()
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <Sectioned onAction={onAction} onSelectionChange={onSelectionChange} />
    ))

    const item = container.querySelectorAll(
      "[data-slot=list-box-item]"
    )[1] as HTMLElement
    fireEvent.pointerDown(item, { pointerId: 1, pointerType: "mouse" })
    fireEvent.click(item)
    expect(onAction).toHaveBeenCalledWith("edit-file")
    expect(onSelectionChange).toHaveBeenCalledOnce()
  })

  it("renders an empty section as header only", () => {
    const { container } = render(() => (
      <ListBoxRoot aria-label="Empty">
        <ListBoxSectionRoot>
          <HeaderRoot>Nothing here</HeaderRoot>
        </ListBoxSectionRoot>
      </ListBoxRoot>
    ))
    const section = container.querySelector("[data-slot=list-box-section]")
    expect(section?.textContent).toBe("Nothing here")
    expect(container.querySelectorAll("[data-slot=list-box-item]").length).toBe(
      0
    )
  })
})
