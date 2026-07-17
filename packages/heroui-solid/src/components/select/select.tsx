import {
  cn,
  listboxItemVariants,
  type SelectVariants,
  selectVariants
} from "@heroui/styles"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  HiddenSelect as HiddenSelectPrimitive,
  Content as SelectContentPrimitive,
  Item as SelectItemPrimitive,
  Portal as SelectPortalPrimitive,
  Root as SelectPrimitive,
  type SelectRootItemComponentProps,
  Trigger as SelectTriggerPrimitive,
  Value as SelectValuePrimitive,
  useSelectContext
} from "@kobalte/core/select"
import {
  type Accessor,
  type ComponentProps,
  children,
  createComputed,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  Show,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { FieldContext } from "../../utils/field-context"
import { SurfaceContext } from "../surface/surface"

type Key = string

type SelectPrimitiveProps = ComponentProps<typeof SelectPrimitive>
type SelectPopoverPlacement = SelectPrimitiveProps["placement"]

/* -------------------------------------------------------------------------------------------------
 * Select Context
 * -----------------------------------------------------------------------------------------------*/
interface ListBoxItemDescriptor {
  id: Key
  textValue: string
  disabled: boolean
  variant?: "default" | "danger"
  class?: string
  render: () => JSX.Element
}

type SelectContextValue = {
  slots?: ReturnType<typeof selectVariants>
  setItems?: (items: ListBoxItemDescriptor[]) => void
  setPlacement?: (placement: SelectPopoverPlacement) => void
}

const SelectContext = createContext<SelectContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Select Root
 * -----------------------------------------------------------------------------------------------*/
interface SelectRootProps extends SelectVariants {
  placeholder?: JSX.Element
  selectionMode?: "single" | "multiple"
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  disabledKeys?: Iterable<Key>
  value?: Key | Key[] | null
  defaultValue?: Key | Key[] | null
  onChange?: (value: Key | Key[] | null) => void
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  name?: string
  class?: string
  children?: JSX.Element
}

const SelectRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as SelectRootProps,
    selectVariants.variantKeys,
    [
      "selectionMode",
      "isOpen",
      "disabledKeys",
      "value",
      "defaultValue",
      "onChange",
      "isDisabled",
      "isRequired",
      "isInvalid",
      "class",
      "children"
    ]
  )

  const slots = createMemo(() => selectVariants(variantProps))
  const [items, setItems] = createSignal<ListBoxItemDescriptor[]>([])
  const [placement, setPlacement] =
    createSignal<SelectPopoverPlacement>("bottom")

  const isMultiple = () => local.selectionMode === "multiple"
  const disabledKeys = createMemo(() => new Set(local.disabledKeys ?? []))

  // Kobalte's value API is option objects; it only ever reads `optionValue`
  // off controlled values, so keys wrap as bare {id} stubs.
  const toOption = (key: Key) => ({ id: key }) as ListBoxItemDescriptor
  const toOptions = (value: Key | Key[] | null | undefined) => {
    if (value == null) {
      return value
    }
    return isMultiple()
      ? (value as Key[]).map(toOption)
      : toOption(value as Key)
  }

  const handleChange = (
    option: ListBoxItemDescriptor | ListBoxItemDescriptor[] | null
  ) => {
    if (Array.isArray(option)) {
      local.onChange?.(option.map((item) => item.id))
    } else {
      local.onChange?.(option?.id ?? null)
    }
  }

  const itemComponent = (
    itemProps: SelectRootItemComponentProps<ListBoxItemDescriptor>
  ) => {
    const descriptor = () => itemProps.item.rawValue
    const itemSlots = createMemo(() =>
      listboxItemVariants({ variant: descriptor().variant ?? "default" })
    )

    return (
      <SelectItemPrimitive
        class={cn(itemSlots().item(), descriptor().class)}
        data-slot="list-box-item"
        item={itemProps.item}
      >
        {descriptor().render()}
      </SelectItemPrimitive>
    )
  }

  return (
    <SelectPrimitive<ListBoxItemDescriptor>
      class={cn(slots().base(), local.class)}
      data-slot="select"
      // Kobalte types `multiple` as a literal, but the runtime takes either;
      // the casts here and on value/defaultValue pin the multiple-mode overload.
      multiple={isMultiple() as true}
      options={items()}
      optionValue="id"
      optionTextValue="textValue"
      optionDisabled={(option: ListBoxItemDescriptor) =>
        option.disabled || disabledKeys().has(option.id)
      }
      open={local.isOpen}
      value={toOptions(local.value) as ListBoxItemDescriptor[] | undefined}
      defaultValue={
        toOptions(local.defaultValue) as ListBoxItemDescriptor[] | undefined
      }
      onChange={handleChange}
      placement={placement()}
      itemComponent={itemComponent}
      validationState={local.isInvalid ? "invalid" : undefined}
      disabled={local.isDisabled}
      required={local.isRequired}
      // HeroUI CSS matches explicit data-*="true" values; Kobalte stamps empty
      // strings, so re-stamp here (rest spreads after Kobalte's dataset).
      data-invalid={local.isInvalid ? "true" : undefined}
      data-required={local.isRequired ? "true" : undefined}
      data-disabled={local.isDisabled ? "true" : undefined}
      {...rest}
    >
      <FieldContext.Provider value={true}>
        <SelectContext.Provider
          value={{
            get slots() {
              return slots()
            },
            setItems,
            setPlacement
          }}
        >
          <HiddenSelectPrimitive />
          {local.children}
        </SelectContext.Provider>
      </FieldContext.Provider>
    </SelectPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Select Trigger
 * -----------------------------------------------------------------------------------------------*/
interface SelectTriggerProps {
  class?: string
  children?: JSX.Element
}

const SelectTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, SelectTriggerProps>
) => {
  const [local, rest] = splitProps(props as SelectTriggerProps, ["class"])
  const context = useContext(SelectContext)

  return (
    <SelectTriggerPrimitive
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="select-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Select Value
 * -----------------------------------------------------------------------------------------------*/
interface SelectValueState {
  selectedOption: Accessor<ListBoxItemDescriptor | undefined>
  selectedOptions: Accessor<ListBoxItemDescriptor[]>
  remove: (option: ListBoxItemDescriptor) => void
  clear: () => void
}

interface SelectValueProps {
  class?: string
  children?: JSX.Element | ((state: SelectValueState) => JSX.Element)
}

const SelectValue = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, SelectValueProps>
) => {
  const [local, rest] = splitProps(props as SelectValueProps, [
    "class",
    "children"
  ])
  const context = useContext(SelectContext)

  return (
    <SelectValuePrimitive<ListBoxItemDescriptor>
      class={cn(context.slots?.value(), local.class)}
      data-slot="select-value"
      {...rest}
    >
      {(state) => {
        const body = local.children
        if (typeof body === "function") {
          return body(state)
        }
        return (
          body ??
          state
            .selectedOptions()
            .map((option) => option.textValue)
            .join(", ")
        )
      }}
    </SelectValuePrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Select Indicator
 * -----------------------------------------------------------------------------------------------*/
const IconChevronDown = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

interface SelectIndicatorProps {
  class?: string
  children?: JSX.Element
}

const SelectIndicator = <T extends ValidComponent = "svg">(
  props: PolymorphicProps<T, SelectIndicatorProps>
) => {
  const [local, rest] = splitProps(props as SelectIndicatorProps, [
    "class",
    "children"
  ])
  const context = useContext(SelectContext)
  const selectContext = useSelectContext()
  const resolved = children(() => local.children)

  return (
    <Show
      when={resolved()}
      fallback={
        <IconChevronDown
          class={cn(context.slots?.indicator(), local.class)}
          data-open={selectContext.isOpen() ? "true" : undefined}
          data-slot="select-default-indicator"
          {...rest}
        />
      }
    >
      <span
        class={cn(context.slots?.indicator(), local.class)}
        data-open={selectContext.isOpen() ? "true" : undefined}
        data-slot="select-indicator"
        {...rest}
      >
        {resolved()}
      </span>
    </Show>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Select Popover
 * -----------------------------------------------------------------------------------------------*/
interface SelectPopoverProps {
  class?: string
  children?: JSX.Element
  placement?: SelectPopoverPlacement
}

const SelectPopover = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectPopoverProps>
) => {
  const [local, rest] = splitProps(props as SelectPopoverProps, [
    "class",
    "children",
    "placement"
  ])
  const context = useContext(SelectContext)

  createComputed(() => {
    if (local.placement) {
      context.setPlacement?.(local.placement)
    }
  })

  // Resolve children eagerly so the ListBox registers its items before the
  // content mounts (Kobalte refuses to open a select with zero options).
  const resolved = children(() => local.children)

  return (
    <SurfaceContext.Provider value={{ variant: "default" }}>
      <SelectPortalPrimitive>
        <SelectContentPrimitive
          class={cn(context.slots?.popover(), local.class)}
          data-slot="select-popover"
          {...rest}
        >
          {resolved()}
        </SelectContentPrimitive>
      </SelectPortalPrimitive>
    </SurfaceContext.Provider>
  )
}

export type {
  ListBoxItemDescriptor,
  SelectContextValue,
  SelectIndicatorProps,
  SelectPopoverProps,
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectValueState
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  SelectContext,
  SelectIndicator,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectValue
}
