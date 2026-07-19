import { cn, tagGroupVariants } from "@heroui/styles"
import {
  type Accessor,
  createContext,
  createMemo,
  createSignal,
  For,
  type JSX,
  Show,
  splitProps,
  useContext
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * TagGroup Context
 * -----------------------------------------------------------------------------------------------*/
type TagKey = string
type TagSize = "sm" | "md" | "lg"
type TagVariant = "default" | "surface"
type TagSelectionMode = "none" | "single" | "multiple"

type TagRegistration = {
  key: TagKey
  el: HTMLElement
  disabled: Accessor<boolean>
}

type TagGroupContextValue = {
  slots: () => ReturnType<typeof tagGroupVariants>
  size: () => TagSize | undefined
  variant: () => TagVariant | undefined
  selectionMode: () => TagSelectionMode
  isSelected: (key: TagKey) => boolean
  toggle: (key: TagKey) => void
  isDisabled: (key: TagKey) => boolean
  allowsRemoving: () => boolean
  remove: (keys: Set<TagKey>, originEl?: HTMLElement) => void
  tabStopKey: () => TagKey | undefined
  register: (registration: TagRegistration) => () => void
  onListKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent>
}

const TagGroupContext = createContext<TagGroupContextValue>()

const TABBABLE_SELECTOR =
  "a[href],button:not([disabled]),input:not([disabled])," +
  "select:not([disabled]),textarea:not([disabled])," +
  "[tabindex]:not([tabindex='-1'])"

// The last tabbable element that precedes `fromEl` in document order and isn't
// inside `excludeEl`. `fromEl` itself need not be tabbable (e.g. the group
// container). Used to land focus on whatever comes before the tag group — the
// Select/Autocomplete trigger the tags render inside — when a tag is removed.
const previousTabbable = (
  fromEl: Element,
  excludeEl?: Element | null
): HTMLElement | undefined => {
  let result: HTMLElement | undefined
  for (const el of document.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)) {
    const precedes =
      fromEl.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING
    if (!precedes) continue
    if (excludeEl?.contains(el)) continue
    result = el
  }
  return result
}

const useTagGroup = (): TagGroupContextValue => {
  const ctx = useContext(TagGroupContext)
  if (!ctx) {
    throw new Error("Tag parts must be used within <TagGroup>")
  }
  return ctx
}

/* -------------------------------------------------------------------------------------------------
 * TagGroup Root
 * -----------------------------------------------------------------------------------------------*/
interface TagGroupRootProps {
  size?: TagSize
  variant?: TagVariant
  selectionMode?: TagSelectionMode
  selectedKeys?: Iterable<TagKey>
  defaultSelectedKeys?: Iterable<TagKey>
  onSelectionChange?: (keys: Set<TagKey>) => void
  disabledKeys?: Iterable<TagKey>
  onRemove?: (keys: Set<TagKey>) => void
  class?: string
  children?: JSX.Element
}

const TagGroupRoot = (props: TagGroupRootProps) => {
  const [local, rest] = splitProps(props, [
    "size",
    "variant",
    "selectionMode",
    "selectedKeys",
    "defaultSelectedKeys",
    "onSelectionChange",
    "disabledKeys",
    "onRemove",
    "class",
    "children"
  ])
  const slots = createMemo(() => tagGroupVariants())

  const [uncontrolled, setUncontrolled] = createSignal<Set<TagKey>>(
    new Set(local.defaultSelectedKeys ?? [])
  )
  const selected = () => new Set<TagKey>(local.selectedKeys ?? uncontrolled())
  const setSelected = (next: Set<TagKey>) => {
    if (local.selectedKeys === undefined) setUncontrolled(next)
    local.onSelectionChange?.(next)
  }
  const selectionMode = () => local.selectionMode ?? "none"
  const toggle = (key: TagKey) => {
    if (selectionMode() === "none") return
    const current = selected()
    const next = new Set(current)
    if (selectionMode() === "single") {
      const wasSelected = current.has(key)
      next.clear()
      if (!wasSelected) next.add(key)
    } else if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setSelected(next)
  }
  const disabledKeys = () => new Set<TagKey>(local.disabledKeys ?? [])

  // Roving tabindex: tags register on mount (in DOM order); the first enabled
  // tag is the default tab stop until arrow-key navigation moves focus.
  const [tags, setTags] = createSignal<TagRegistration[]>([])
  const [focusedKey, setFocusedKey] = createSignal<TagKey | undefined>()
  const tabStopKey = () => {
    const enabled = tags().filter((tag) => !tag.disabled())
    const focused = focusedKey()
    // Fall back to the first enabled tag when focus points at a tag that was
    // removed or disabled — otherwise no tag gets tabindex=0 (dead tab stop).
    if (focused !== undefined && enabled.some((tag) => tag.key === focused)) {
      return focused
    }
    return enabled[0]?.key
  }
  const focusKey = (key: TagKey) => {
    const registration = tags().find((tag) => tag.key === key)
    if (registration) {
      setFocusedKey(key)
      registration.el.focus()
    }
  }

  const onListKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (
    event
  ) => {
    const enabled = tags().filter((tag) => !tag.disabled())
    if (enabled.length === 0) return
    const activeKey = focusedKey() ?? tabStopKey()
    const index = enabled.findIndex((tag) => tag.key === activeKey)
    let next = index
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index < enabled.length - 1 ? index + 1 : 0
        break
      case "ArrowLeft":
      case "ArrowUp":
        next = index > 0 ? index - 1 : enabled.length - 1
        break
      case "Home":
        next = 0
        break
      case "End":
        next = enabled.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    focusKey(enabled[next].key)
  }

  const context: TagGroupContextValue = {
    slots,
    size: () => local.size,
    variant: () => local.variant,
    selectionMode,
    isSelected: (key) => selected().has(key),
    toggle,
    isDisabled: (key) => disabledKeys().has(key),
    allowsRemoving: () => local.onRemove !== undefined,
    remove: (keys, originEl) => {
      // Removing a tag re-renders the whole tag list (the Select value's render
      // prop rebuilds it), so captured tag/remove-button elements are stale by
      // the time focus should move. Instead record the removed tag's position
      // and a stable fallback now, then after the re-render re-query the live
      // list: focus the previous tag's remove button, else the element before
      // the group (e.g. the Select/Autocomplete trigger).
      let container: Element | null = null
      let removedIndex = -1
      let fallback: HTMLElement | undefined
      if (originEl) {
        const tagEl = originEl.closest("[data-slot='tag']")
        const groupEl = originEl.closest("[data-slot='tag-group']")
        // The group's parent survives the list rebuild; scope re-queries to it.
        container = groupEl?.parentElement ?? groupEl
        if (groupEl && tagEl) {
          removedIndex = Array.from(
            groupEl.querySelectorAll("[data-slot='tag']")
          ).indexOf(tagEl)
        }
        fallback = previousTabbable(groupEl ?? originEl, groupEl ?? tagEl)
      }
      local.onRemove?.(keys)
      queueMicrotask(() => {
        let target: HTMLElement | undefined
        if (removedIndex > 0 && container?.isConnected) {
          const buttons = Array.from(
            container.querySelectorAll<HTMLElement>(
              "[data-slot='tag-remove-button']"
            )
          )
          target = buttons[Math.min(removedIndex - 1, buttons.length - 1)]
        }
        if (!target?.isConnected && fallback?.isConnected) {
          target = fallback
        }
        target?.focus({ preventScroll: true })
      })
    },
    tabStopKey,
    register: (registration) => {
      setTags((prev) => [...prev, registration])
      return () => setTags((prev) => prev.filter((tag) => tag !== registration))
    },
    onListKeyDown
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: group role labels the tag collection
    <div
      class={cn(slots().base(), local.class)}
      data-slot="tag-group"
      role="group"
      {...rest}
    >
      <TagGroupContext.Provider value={context}>
        {local.children}
      </TagGroupContext.Provider>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * TagGroup List
 * -----------------------------------------------------------------------------------------------*/
interface TagGroupListProps<T> {
  items?: readonly T[]
  renderEmptyState?: () => JSX.Element
  class?: string
  children?: JSX.Element | ((item: T) => JSX.Element)
}

const TagGroupList = <T,>(props: TagGroupListProps<T>) => {
  const ctx = useTagGroup()
  const [local, rest] = splitProps(props as TagGroupListProps<T>, [
    "items",
    "renderEmptyState",
    "class",
    "children"
  ])

  return (
    // biome-ignore lint/a11y/useSemanticElements: grid role mirrors React Aria's TagList
    <div
      class={cn(ctx.slots().list(), local.class)}
      data-slot="tag-group-list"
      role="grid"
      onKeyDown={ctx.onListKeyDown}
      {...rest}
    >
      {/* Static children (no `items`) render as-is. With `items`, keep the
          <For> at a fixed position so it diffs on data change instead of the
          whole subtree being torn down (which would remount every Tag). */}
      <Show
        when={local.items !== undefined}
        fallback={local.children as JSX.Element}
      >
        <Show
          when={(local.items?.length ?? 0) > 0}
          fallback={local.renderEmptyState?.()}
        >
          <For each={(local.items ?? []) as T[]}>
            {(item) => (local.children as (item: T) => JSX.Element)(item)}
          </For>
        </Show>
      </Show>
    </div>
  )
}

export type {
  TagGroupContextValue,
  TagGroupListProps,
  TagGroupRootProps,
  TagKey,
  TagSelectionMode,
  TagSize,
  TagVariant
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { TagGroupContext, TagGroupList, TagGroupRoot, useTagGroup }
