import { createContext, type JSX, useContext } from "solid-js"

/*
 * Deferred collection nodes. Inside a Select's popover, the ListBox must
 * resolve its children eagerly so items register before Kobalte refuses to
 * open a zero-option select (see AGENTS.md) — but the popover is closed during
 * SSR/hydration, so any real DOM created while resolving (a section Header, a
 * Separator between sections) has no SSR counterpart and crashes hydration.
 *
 * Components that would create such DOM (Header, Separator) instead return a
 * marker carrying a render thunk when `CollectionDeferContext` is set. The
 * thunk runs only when the section actually renders (popover open, post-
 * hydration), so registration stays DOM-free. Standalone (no provider) the
 * components render normally.
 */
const DEFERRED_NODE = Symbol("heroui-solid.deferred-node")

interface DeferredNode {
  [DEFERRED_NODE]: true
  render: () => JSX.Element
}

const isDeferredNode = (value: unknown): value is DeferredNode =>
  typeof value === "object" &&
  value !== null &&
  DEFERRED_NODE in (value as Record<PropertyKey, unknown>)

const CollectionDeferContext = createContext(false)

// Returns a deferred marker when inside a deferring collection, else undefined
// (the caller then renders normally).
const useCollectionDefer = (
  render: () => JSX.Element
): DeferredNode | undefined =>
  useContext(CollectionDeferContext)
    ? { [DEFERRED_NODE]: true, render }
    : undefined

// Renders a mixed list of deferred markers and plain nodes: markers run their
// thunk, everything else passes through. Used where deferred headers/separators
// are finally placed into the DOM (Select's section view).
const renderDeferred = (nodes: unknown[] | undefined): JSX.Element =>
  nodes?.map((node) =>
    isDeferredNode(node) ? node.render() : (node as JSX.Element)
  ) as unknown as JSX.Element

export type { DeferredNode }
export {
  CollectionDeferContext,
  DEFERRED_NODE,
  isDeferredNode,
  renderDeferred,
  useCollectionDefer
}
