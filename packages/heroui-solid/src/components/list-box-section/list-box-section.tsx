import type { JSX } from "solid-js"

import {
  isItemDescriptor,
  LIST_BOX_SECTION,
  type ListBoxSectionDescriptor
} from "../list-box/list-box"

const flattenChildren = (value: unknown): unknown[] => {
  if (typeof value === "function" && !(value as () => unknown).length) {
    return flattenChildren((value as () => unknown)())
  }
  if (Array.isArray(value)) {
    return value.flatMap(flattenChildren)
  }
  return value == null || value === false ? [] : [value]
}

/* -------------------------------------------------------------------------------------------------
 * ListBox Section Root
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxSectionRootProps {
  class?: string
  children?: JSX.Element
}

// Returns a section descriptor instead of DOM: the enclosing ListBox groups
// its item descriptors as Kobalte options and renders the header via
// renderSection (see list-box.tsx ListBoxSectionView). Inside a Select the
// header's children are Header/Separator deferral markers, not DOM, so
// resolving here creates nothing to desync hydration (see AGENTS.md).
const ListBoxSectionRoot = (props: ListBoxSectionRootProps): JSX.Element => {
  // Manual single-read cache instead of the children() helper: server memos
  // evaluate eagerly while client memos stay lazy, and an unbalanced
  // first-resolution point desyncs hydration ids (see AGENTS.md).
  let cache: unknown[] | undefined
  const resolve = (): unknown[] => {
    if (cache === undefined) {
      cache = flattenChildren(props.children)
    }
    return cache
  }
  // Resolve at a fixed point on both server and client.
  resolve()

  const descriptor: ListBoxSectionDescriptor = {
    // @ts-expect-error marker key identifies section descriptors during child resolution
    [LIST_BOX_SECTION]: true,
    // Separators preceding this section; set by the ListBox in Select mode.
    leading: undefined,
    get class() {
      return props.class
    },
    get items() {
      return resolve().filter(isItemDescriptor)
    },
    get header() {
      return resolve().filter((child) => !isItemDescriptor(child))
    }
  }

  return descriptor as unknown as JSX.Element
}

export type { ListBoxSectionRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { ListBoxSectionRoot }
