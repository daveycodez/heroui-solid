import { children, type JSX } from "solid-js"

import {
  isItemDescriptor,
  LIST_BOX_SECTION,
  type ListBoxSectionDescriptor
} from "../list-box/list-box"

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
  // Reactive children() helper so dynamic sections (<For> of items driven by
  // a signal) re-track, same as un-sectioned items in ListBoxRoot. Kobalte
  // reads the items getter inside its collection memo, so re-resolution
  // flows through without the enclosing ListBox re-running.
  const resolved = children(() => props.children)
  // Resolve at a fixed point on both server and client: server memos
  // evaluate eagerly at creation while client memos are lazy — an unbalanced
  // first-resolution point desyncs hydration ids (see AGENTS.md).
  resolved()

  const descriptor: ListBoxSectionDescriptor = {
    // @ts-expect-error marker key identifies section descriptors during child resolution
    [LIST_BOX_SECTION]: true,
    // Separators preceding this section; set by the ListBox in Select mode.
    leading: undefined,
    get class() {
      return props.class
    },
    get items() {
      // `as unknown[]` so the isItemDescriptor guard narrows (matches ListBox).
      return (resolved.toArray() as unknown[]).filter(isItemDescriptor)
    },
    get header() {
      return resolved
        .toArray()
        .filter(
          (child) =>
            child != null && child !== false && !isItemDescriptor(child)
        )
    }
  }

  return descriptor as unknown as JSX.Element
}

export type { ListBoxSectionRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { ListBoxSectionRoot }
