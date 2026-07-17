import {
  cn,
  type ListBoxVariants,
  listboxItemVariants,
  listboxVariants
} from "@heroui/styles"
import type { CollectionNode } from "@kobalte/core"
import {
  ItemIndicator as ItemIndicatorPrimitive,
  Item as ListboxItemPrimitive,
  Root as ListboxRootPrimitive
} from "@kobalte/core/listbox"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Listbox as SelectListboxPrimitive } from "@kobalte/core/select"
import {
  type ComponentProps,
  children,
  createComputed,
  createContext,
  createMemo,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * ListBox Context
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxItemDescriptor {
  id: string
  textValue: string
  disabled: boolean
  variant?: "default" | "danger"
  class?: string
  render: () => JSX.Element
}

const LIST_BOX_ITEM = Symbol("heroui-solid.list-box-item")

const isItemDescriptor = (value: unknown): value is ListBoxItemDescriptor =>
  typeof value === "object" &&
  value !== null &&
  LIST_BOX_ITEM in (value as Record<PropertyKey, unknown>)

// Inside a Select, the ListBox resolves to this marker instead of JSX: popover
// children are resolved eagerly (items must register during render), and real
// JSX would create the closed listbox DOM during SSR/hydration (see AGENTS.md).
const LIST_BOX_RENDER = Symbol("heroui-solid.list-box-render")

interface ListBoxRenderMarker {
  [LIST_BOX_RENDER]: true
  render: () => JSX.Element
}

const isListBoxRenderMarker = (value: unknown): value is ListBoxRenderMarker =>
  typeof value === "object" &&
  value !== null &&
  LIST_BOX_RENDER in (value as Record<PropertyKey, unknown>)

// Provided by Select.Root: registers the ListBox's item descriptors as the
// enclosing Kobalte Select's options. Absent when the ListBox is standalone.
const ListBoxCollectionContext = createContext<
  ((items: ListBoxItemDescriptor[]) => void) | undefined
>()

// Kobalte's Select.Item and Listbox.Item are the same underlying component,
// so both the Select root's itemComponent and the standalone ListBox's
// renderItem render descriptors through this one view.
const ListBoxItemView = (props: {
  item: CollectionNode<ListBoxItemDescriptor>
}) => {
  const descriptor = () => props.item.rawValue
  const itemSlots = createMemo(() =>
    listboxItemVariants({ variant: descriptor().variant ?? "default" })
  )

  return (
    <ListboxItemPrimitive
      class={cn(itemSlots().item(), descriptor().class)}
      data-slot="list-box-item"
      item={props.item}
    >
      {descriptor().render()}
    </ListboxItemPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ListBox Root
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxRootProps extends ListBoxVariants {
  class?: string
  children?: JSX.Element
  selectionMode?: "none" | "single" | "multiple"
  selectedKeys?: Iterable<string>
  defaultSelectedKeys?: Iterable<string>
  onSelectionChange?: (keys: Set<string>) => void
  disabledKeys?: Iterable<string>
}

const ListBoxRoot = <T extends ValidComponent = "ul">(
  props: PolymorphicProps<T, ListBoxRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as ListBoxRootProps,
    listboxVariants.variantKeys,
    // Inside a Select the selection props are inherited from the Select root;
    // standalone they drive Kobalte's listbox directly.
    [
      "class",
      "children",
      "selectionMode",
      "selectedKeys",
      "defaultSelectedKeys",
      "onSelectionChange",
      "disabledKeys"
    ]
  )
  const setItems = useContext(ListBoxCollectionContext)

  const resolved = children(() => local.children)

  if (setItems) {
    createComputed(() => {
      setItems((resolved.toArray() as unknown[]).filter(isItemDescriptor))
    })

    // Resolves to a render marker instead of JSX so the popover's eager child
    // resolution registers items without creating the closed listbox DOM
    // during SSR/hydration (see AGENTS.md); the popover calls render() on open.
    const marker: ListBoxRenderMarker = {
      [LIST_BOX_RENDER]: true,
      render: () => (
        <SelectListboxPrimitive
          class={cn(listboxVariants(variantProps), local.class)}
          data-slot="list-box"
          {...rest}
        />
      )
    }

    return marker as unknown as JSX.Element
  }

  const items = createMemo(() =>
    (resolved.toArray() as unknown[]).filter(isItemDescriptor)
  )
  const disabledKeys = createMemo(() => new Set(local.disabledKeys ?? []))

  const renderItem = (item: CollectionNode<ListBoxItemDescriptor>) => (
    <ListBoxItemView item={item} />
  )

  return (
    <ListboxRootPrimitive<ListBoxItemDescriptor>
      class={cn(listboxVariants(variantProps), local.class)}
      data-slot="list-box"
      options={items()}
      optionValue="id"
      optionTextValue="textValue"
      optionDisabled={(option: ListBoxItemDescriptor) =>
        option.disabled || disabledKeys().has(option.id)
      }
      selectionMode={local.selectionMode}
      value={local.selectedKeys}
      defaultValue={local.defaultSelectedKeys}
      onChange={(keys) => local.onSelectionChange?.(keys)}
      renderItem={renderItem}
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

const ListBoxItemIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ListBoxItemIndicatorProps>
) => {
  const [local, rest] = splitProps(props as ListBoxItemIndicatorProps, [
    "class",
    "children"
  ])

  return (
    <ItemIndicatorPrimitive
      class={cn(listboxItemVariants({}).indicator(), local.class)}
      data-slot="list-box-item-indicator"
      {...rest}
    >
      {(() => {
        // Read once, and only when the indicator actually renders: a
        // component-level children() helper resolves custom children eagerly
        // during SSR (server memos run immediately) while the client defers
        // until selection mounts the indicator — desyncing hydration keys.
        const body = local.children
        return body != null ? (
          body
        ) : (
          <IconCheck data-slot="list-box-item-indicator--checkmark" />
        )
      })()}
    </ItemIndicatorPrimitive>
  )
}

export type {
  ListBoxItemDescriptor,
  ListBoxItemIndicatorProps,
  ListBoxItemProps,
  ListBoxRenderMarker,
  ListBoxRootProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  isListBoxRenderMarker,
  ListBoxCollectionContext,
  ListBoxItem,
  ListBoxItemIndicator,
  ListBoxItemView,
  ListBoxRoot
}
