// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import { LabelRoot } from "../label/label"
import { TagRemoveButton, TagRoot } from "../tag/tag"
import { TagGroupList, TagGroupRoot } from "./tag-group"

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement
const slots = (container: HTMLElement, name: string) =>
  Array.from(
    container.querySelectorAll(`[data-slot="${name}"]`)
  ) as HTMLElement[]

describe("TagGroup", () => {
  it("renders the group, list, and tags with BEM classes and roles", () => {
    const { container } = render(() => (
      <TagGroupRoot selectionMode="single">
        <LabelRoot>Tags</LabelRoot>
        <TagGroupList>
          <TagRoot id="news">News</TagRoot>
          <TagRoot id="travel">Travel</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const group = slot(container, "tag-group")
    expect(classSet(group.className)).toEqual(new Set(["tag-group"]))
    expect(group.getAttribute("role")).toBe("group")

    const list = slot(container, "tag-group-list")
    expect(list.getAttribute("role")).toBe("grid")

    const tags = slots(container, "tag")
    expect(tags).toHaveLength(2)
    expect(tags[0].classList.contains("tag")).toBe(true)
    expect(tags[0].classList.contains("tag--md")).toBe(true)
    expect(tags[0].classList.contains("tag--default")).toBe(true)
  })

  it("single-selects on click and replaces the previous selection", () => {
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <TagGroupRoot
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <TagGroupList>
          <TagRoot id="news">News</TagRoot>
          <TagRoot id="travel">Travel</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const [news, travel] = slots(container, "tag")

    fireEvent.click(news)
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["news"]))
    expect(news.getAttribute("data-selected")).toBe("true")

    fireEvent.click(travel)
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["travel"]))
    expect(news.hasAttribute("data-selected")).toBe(false)
    expect(travel.getAttribute("data-selected")).toBe("true")
  })

  it("multi-selects and toggles independently", () => {
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <TagGroupRoot
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      >
        <TagGroupList>
          <TagRoot id="news">News</TagRoot>
          <TagRoot id="travel">Travel</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const [news, travel] = slots(container, "tag")
    fireEvent.click(news)
    fireEvent.click(travel)
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set(["news", "travel"])
    )
    fireEvent.click(news)
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["travel"]))
  })

  it("reflects controlled selectedKeys", () => {
    const { container } = render(() => (
      <TagGroupRoot selectionMode="multiple" selectedKeys={new Set(["travel"])}>
        <TagGroupList>
          <TagRoot id="news">News</TagRoot>
          <TagRoot id="travel">Travel</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const [news, travel] = slots(container, "tag")
    expect(news.getAttribute("aria-selected")).toBe("false")
    expect(travel.getAttribute("data-selected")).toBe("true")
  })

  it("disables tags via isDisabled and disabledKeys and blocks selection", () => {
    const onSelectionChange = vi.fn()
    const { container } = render(() => (
      <TagGroupRoot
        selectionMode="single"
        disabledKeys={["travel"]}
        onSelectionChange={onSelectionChange}
      >
        <TagGroupList>
          <TagRoot id="news" isDisabled>
            News
          </TagRoot>
          <TagRoot id="travel">Travel</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const [news, travel] = slots(container, "tag")
    expect(news.getAttribute("data-disabled")).toBe("true")
    expect(travel.getAttribute("data-disabled")).toBe("true")

    fireEvent.click(news)
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it("applies inherited size and variant to tags", () => {
    const { container } = render(() => (
      <TagGroupRoot selectionMode="single" size="lg" variant="surface">
        <TagGroupList>
          <TagRoot id="news">News</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const tag = slot(container, "tag")
    expect(tag.classList.contains("tag--lg")).toBe(true)
    expect(tag.classList.contains("tag--surface")).toBe(true)
  })

  it("auto-renders a remove button and calls onRemove", () => {
    const onRemove = vi.fn()
    const { container } = render(() => (
      <TagGroupRoot selectionMode="single" onRemove={onRemove}>
        <TagGroupList>
          <TagRoot id="news">News</TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const removeButton = slot(container, "tag-remove-button")
    expect(removeButton).not.toBeNull()
    fireEvent.click(removeButton)
    expect(onRemove).toHaveBeenCalledWith(new Set(["news"]))
  })

  it("supports a custom remove button through render-prop children", () => {
    const onRemove = vi.fn()
    const { container } = render(() => (
      <TagGroupRoot selectionMode="single" onRemove={onRemove}>
        <TagGroupList>
          <TagRoot id="news">
            {(renderProps) => (
              <>
                News
                {renderProps.allowsRemoving && (
                  <TagRemoveButton>
                    <span data-testid="custom-x" />
                  </TagRemoveButton>
                )}
              </>
            )}
          </TagRoot>
        </TagGroupList>
      </TagGroupRoot>
    ))
    const removeButton = slot(container, "tag-remove-button")
    expect(removeButton.querySelector("[data-testid=custom-x]")).not.toBeNull()
    fireEvent.click(removeButton)
    expect(onRemove).toHaveBeenCalledWith(new Set(["news"]))
  })

  it("renders items with a render function and the empty state when empty", () => {
    const { container: filled } = render(() => (
      <TagGroupRoot selectionMode="single">
        <TagGroupList
          items={[{ id: "a", name: "Alpha" }]}
          renderEmptyState={() => <div data-testid="empty">Nothing</div>}
        >
          {(item: { id: string; name: string }) => (
            <TagRoot id={item.id}>{item.name}</TagRoot>
          )}
        </TagGroupList>
      </TagGroupRoot>
    ))
    expect(slots(filled, "tag")).toHaveLength(1)

    const { container: empty } = render(() => (
      <TagGroupRoot selectionMode="single">
        <TagGroupList
          items={[]}
          renderEmptyState={() => <div data-testid="empty">Nothing</div>}
        >
          {(item: { id: string; name: string }) => (
            <TagRoot id={item.id}>{item.name}</TagRoot>
          )}
        </TagGroupList>
      </TagGroupRoot>
    ))
    expect(empty.querySelector("[data-testid=empty]")).not.toBeNull()
    expect(slots(empty, "tag")).toHaveLength(0)
  })
})
