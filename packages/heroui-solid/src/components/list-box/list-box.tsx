import {
  cn,
  type ListBoxVariants,
  listboxItemVariants,
  listboxVariants
} from "@heroui/styles"
import {
  ItemIndicator as ItemIndicatorPrimitive,
  Listbox as ListboxPrimitive
} from "@kobalte/core/select"
import {
  type ComponentProps,
  children,
  createComputed,
  type JSX,
  Show,
  splitProps,
  useContext
} from "solid-js"

import { type ListBoxItemDescriptor, SelectContext } from "../select/select"

const LIST_BOX_ITEM = Symbol("heroui-solid.list-box-item")

const isItemDescriptor = (value: unknown): value is ListBoxItemDescriptor =>
  typeof value === "object" &&
  value !== null &&
  LIST_BOX_ITEM in (value as Record<PropertyKey, unknown>)

/* -------------------------------------------------------------------------------------------------
 * ListBox Root
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxRootProps extends ListBoxVariants {
  class?: string
  children?: JSX.Element
  selectionMode?: "single" | "multiple"
}

const ListBoxRoot = (props: ListBoxRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    listboxVariants.variantKeys,
    // selectionMode is inherited from the enclosing Select root.
    ["class", "children", "selectionMode"]
  )
  const context = useContext(SelectContext)

  const resolved = children(() => local.children)

  createComputed(() => {
    context.setItems?.(
      (resolved.toArray() as unknown[]).filter(isItemDescriptor)
    )
  })

  return (
    <ListboxPrimitive
      class={cn(listboxVariants(variantProps), local.class)}
      data-slot="list-box"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * ListBox Item
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxItemProps {
  id: string
  textValue?: string
  isDisabled?: boolean
  variant?: "default" | "danger"
  class?: string
  children?: JSX.Element
}

// Returns an item descriptor instead of DOM: the enclosing ListBox collects
// descriptors and registers them as the Select's options; the Select's
// itemComponent calls render() inside Kobalte's item context.
const ListBoxItem = (props: ListBoxItemProps): JSX.Element => {
  const descriptor: ListBoxItemDescriptor = {
    // @ts-expect-error marker key identifies descriptors during child resolution
    [LIST_BOX_ITEM]: true,
    get id() {
      return props.id
    },
    get textValue() {
      return props.textValue ?? props.id
    },
    get disabled() {
      return !!props.isDisabled
    },
    get variant() {
      return props.variant
    },
    get class() {
      return props.class
    },
    render: () => props.children
  }

  return descriptor as unknown as JSX.Element
}

/* -------------------------------------------------------------------------------------------------
 * ListBox Item Indicator
 * -----------------------------------------------------------------------------------------------*/
const IconCheck = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="3"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
)

interface ListBoxItemIndicatorProps {
  class?: string
  children?: JSX.Element
  forceMount?: boolean
}

const ListBoxItemIndicator = (props: ListBoxItemIndicatorProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const resolved = children(() => local.children)

  return (
    <ItemIndicatorPrimitive
      class={cn(listboxItemVariants({}).indicator(), local.class)}
      data-slot="list-box-item-indicator"
      {...rest}
    >
      <Show
        when={resolved()}
        fallback={<IconCheck data-slot="list-box-item-indicator--checkmark" />}
      >
        {resolved()}
      </Show>
    </ItemIndicatorPrimitive>
  )
}

export type { ListBoxItemIndicatorProps, ListBoxItemProps, ListBoxRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { ListBoxItem, ListBoxItemIndicator, ListBoxRoot }
