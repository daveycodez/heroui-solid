import type { JSX } from "solid-js"
import { useContext } from "solid-js"

import {
  isItemDescriptor,
  LIST_BOX_SECTION,
  ListBoxCollectionContext,
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
// renderSection (see list-box.tsx ListBoxSectionView).
const ListBoxSectionRoot = (props: ListBoxSectionRootProps): JSX.Element => {
  const inSelect = useContext(ListBoxCollectionContext) !== undefined

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
  // Standalone: resolve at a fixed point on both server and client. Inside a
  // Select the section stays unresolved — resolving would create the Header
  // DOM during the closed popover's eager child resolution (see AGENTS.md);
  // sections aren't supported inside Select yet.
  if (!inSelect) {
    resolve()
  }

  const descriptor: ListBoxSectionDescriptor = {
    // @ts-expect-error marker key identifies section descriptors during child resolution
    [LIST_BOX_SECTION]: true,
    get class() {
      return props.class
    },
    get items() {
      return resolve().filter(isItemDescriptor)
    },
    get header() {
      return resolve().filter(
        (child) => !isItemDescriptor(child)
      ) as JSX.Element[]
    }
  }

  return descriptor as unknown as JSX.Element
}

export type { ListBoxSectionRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { ListBoxSectionRoot }
