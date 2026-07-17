// @vitest-environment jsdom
import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
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
