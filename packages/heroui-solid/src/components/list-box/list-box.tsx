import {
  cn,
  type ListBoxItemVariants,
  type ListBoxVariants,
  listboxItemVariants,
  listboxSectionVariants,
  listboxVariants
} from "@heroui/styles"
import type { CollectionNode } from "@kobalte/core"
import {
  ItemIndicator as ItemIndicatorPrimitive,
  Item as ListboxItemPrimitive,
  Root as ListboxRootPrimitive,
  Section as ListboxSectionPrimitive
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
  onMount,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import {
  type DeferredNode,
  isDeferredNode,
  renderDeferred
} from "../../utils/collection-defer"
import { setupInteractionModality } from "../../utils/interaction-modality"

/* -------------------------------------------------------------------------------------------------
 * ListBox Context
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxItemDescriptor {
  id: string
  textValue: string
  disabled: boolean
  variant?: ListBoxItemVariants["variant"]
  class?: string
  render: () => JSX.Element
}

const LIST_BOX_ITEM = Symbol("heroui-solid.list-box-item")

const isItemDescriptor = (value: unknown): value is ListBoxItemDescriptor =>
  typeof value === "object" &&
  value !== null &&
  LIST_BOX_ITEM in (value as Record<PropertyKey, unknown>)

// ListBox.Section resolves to this descriptor (see list-box-section): its
// items feed Kobalte's grouped options, its header renders in renderSection.
// `header`/`leading` hold plain DOM standalone and deferral markers inside a
// Select (resolved via renderDeferred); `leading` is the Separator(s) the
// enclosing ListBox places before this section in Select mode.
interface ListBoxSectionDescriptor {
  class?: string
  items: ListBoxItemDescriptor[]
  header: unknown[]
  leading?: DeferredNode[]
}

const LIST_BOX_SECTION = Symbol("heroui-solid.list-box-section")

const isSectionDescriptor = (
  value: unknown
): value is ListBoxSectionDescriptor =>
  typeof value === "object" &&
  value !== null &&
  LIST_BOX_SECTION in (value as Record<PropertyKey, unknown>)

type ListBoxOption = ListBoxItemDescriptor | ListBoxSectionDescriptor

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

// Provided by Select.Root: registers the ListBox's options (item and section
// descriptors) as the enclosing Kobalte Select's collection. Absent when the
// ListBox is standalone.
const ListBoxCollectionContext = createContext<
  ((options: ListBoxOption[]) => void) | undefined
>()

// Kobalte's Select.Item and Listbox.Item are the same underlying component,
// so both the Select root's itemComponent and the standalone ListBox's
// renderItem render descriptors through this one view. leading/trailing carry
// static siblings (Separator between sections) — fragments flatten them into
// the <ul> in document order.
const ListBoxItemView = (props: {
  item: CollectionNode<ListBoxItemDescriptor>
  onAction?: (key: string) => void
  leading?: JSX.Element[]
  trailing?: JSX.Element[]
}) => {
  const descriptor = () => props.item.rawValue
  const itemSlots = createMemo(() =>
    listboxItemVariants({ variant: descriptor().variant ?? "default" })
  )
  const fireAction = () => {
    if (props.onAction && !props.item.disabled) {
      props.onAction(props.item.key)
    }
  }

  return (
    <>
      {props.leading}
      <ListboxItemPrimitive
        class={cn(itemSlots().item(), descriptor().class)}
        data-slot="list-box-item"
        item={props.item}
        // Kobalte's own handlers compose after these and are inert in
        // selectionMode="none", so onAction fires exactly once per activation.
        onClick={fireAction}
        onKeyDown={(event: KeyboardEvent) => {
          if (
            props.onAction &&
            (event.key === "Enter" || event.key === " ") &&
            !props.item.disabled
          ) {
            event.preventDefault()
            fireAction()
          }
        }}
      >
        {descriptor().render()}
      </ListboxItemPrimitive>
      {props.trailing}
    </>
  )
}

const ListBoxSectionView = (props: {
  section: CollectionNode<ListBoxSectionDescriptor>
  leading?: JSX.Element[]
  trailing?: JSX.Element[]
}) => {
  const descriptor = () => props.section.rawValue

  // A11y deviation: React Aria wraps sections in role="group" with the header
  // as its label; Kobalte's collection is flat, so the section renders as a
  // presentational label <li> between sibling options.
  return (
    <>
      {props.leading}
      <ListboxSectionPrimitive
        class={cn(listboxSectionVariants(), descriptor().class)}
        data-slot="list-box-section"
      >
        {renderDeferred(descriptor().header)}
      </ListboxSectionPrimitive>
      {props.trailing}
    </>
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
  onAction?: (key: string) => void
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
      "onAction",
      "disabledKeys"
    ]
  )
  const setOptions = useContext(ListBoxCollectionContext)
  onMount(setupInteractionModality)

  const resolved = children(() => local.children)

  if (setOptions) {
    createComputed(() => {
      // Register options in document order: item and section descriptors
      // become the Select's Kobalte collection (sections group their items via
      // `optionGroupChildren`). Deferred Separators between sections attach as
      // `leading` on the following section — the Select's sectionComponent
      // renders them. All children resolve to descriptors/markers, never DOM,
      // so the closed popover's eager registration stays hydration-safe.
      const options: ListBoxOption[] = []
      let pendingLeading: DeferredNode[] = []
      for (const child of resolved.toArray() as unknown[]) {
        if (isItemDescriptor(child)) {
          options.push(child)
          pendingLeading = []
        } else if (isSectionDescriptor(child)) {
          child.leading = pendingLeading.length > 0 ? pendingLeading : undefined
          options.push(child)
          pendingLeading = []
        } else if (isDeferredNode(child)) {
          pendingLeading.push(child)
        }
      }
      setOptions(options)
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

  // Children in document order: item/section descriptors become Kobalte
  // options; static JSX (Separator between sections) attaches to the next
  // option (or trails the last) so render fragments keep document order.
  const collection = createMemo(() => {
    const options: ListBoxOption[] = []
    const leading = new Map<ListBoxOption, JSX.Element[]>()
    const trailing = new Map<ListBoxOption, JSX.Element[]>()
    let pending: JSX.Element[] = []
    for (const child of resolved.toArray() as unknown[]) {
      if (isItemDescriptor(child) || isSectionDescriptor(child)) {
        if (pending.length > 0) {
          leading.set(child, pending)
          pending = []
        }
        options.push(child)
      } else if (child != null && child !== false && child !== "") {
        pending.push(child as JSX.Element)
      }
    }
    const last = options[options.length - 1]
    if (pending.length > 0 && last) {
      trailing.set(last, pending)
    }
    return { options, leading, trailing }
  })
  // Resolve at a fixed point on both sides: server memos evaluate eagerly at
  // creation while client memos are lazy — an unbalanced first-resolution
  // point would desync the hydration ids of elements created during
  // resolution (interleaved Separators, section Headers). See AGENTS.md.
  collection()

  const disabledKeys = createMemo(() => new Set(local.disabledKeys ?? []))

  return (
    <ListboxRootPrimitive<ListBoxItemDescriptor, ListBoxSectionDescriptor>
      class={cn(listboxVariants(variantProps), local.class)}
      data-slot="list-box"
      options={collection().options}
      optionValue="id"
      optionTextValue="textValue"
      optionDisabled={(option: ListBoxItemDescriptor) =>
        option.disabled || disabledKeys().has(option.id)
      }
      optionGroupChildren="items"
      selectionMode={local.selectionMode}
      value={local.selectedKeys}
      defaultValue={local.defaultSelectedKeys}
      onChange={(keys) => local.onSelectionChange?.(keys)}
      renderItem={(item) => (
        <ListBoxItemView
          item={item}
          onAction={local.onAction}
          leading={collection().leading.get(item.rawValue)}
          trailing={collection().trailing.get(item.rawValue)}
        />
      )}
      renderSection={(section) => (
        <ListBoxSectionView
          section={section}
          leading={collection().leading.get(section.rawValue)}
          trailing={collection().trailing.get(section.rawValue)}
        />
      )}
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
  variant?: ListBoxItemVariants["variant"]
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
  ListBoxOption,
  ListBoxRenderMarker,
  ListBoxRootProps,
  ListBoxSectionDescriptor
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  isItemDescriptor,
  isListBoxRenderMarker,
  isSectionDescriptor,
  LIST_BOX_SECTION,
  ListBoxCollectionContext,
  ListBoxItem,
  ListBoxItemIndicator,
  ListBoxItemView,
  ListBoxRoot
}
