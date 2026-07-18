import {
  type AutocompleteVariants,
  autocompleteVariants,
  cn,
  listboxSectionVariants
} from "@heroui/styles"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  HiddenSelect as HiddenSelectPrimitive,
  Content as SelectContentPrimitive,
  Portal as SelectPortalPrimitive,
  Root as SelectPrimitive,
  type SelectRootItemComponentProps,
  type SelectRootSectionComponentProps,
  Section as SelectSectionPrimitive,
  Trigger as SelectTriggerPrimitive,
  Value as SelectValuePrimitive,
  useSelectContext
} from "@kobalte/core/select"
import { callHandler, mergeRefs } from "@kobalte/utils"
import {
  type Accessor,
  type ComponentProps,
  children,
  createComputed,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
  Show,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import {
  CollectionDeferContext,
  renderDeferred
} from "../../utils/collection-defer"
import { FieldContext } from "../../utils/field-context"
import { setupInteractionModality } from "../../utils/interaction-modality"
import { PreventScroll } from "../../utils/prevent-scroll"
import {
  isListBoxRenderMarker,
  isSectionDescriptor,
  ListBoxCollectionContext,
  ListBoxEmptyContext,
  type ListBoxItemDescriptor,
  ListBoxItemView,
  type ListBoxOption,
  type ListBoxSectionDescriptor,
  ListBoxVirtualizeContext
} from "../list-box/list-box"
import { SearchFieldControlContext } from "../search-field/search-field"
import { SurfaceContext } from "../surface/surface"

type Key = string
type FilterPredicate = (textValue: string, inputValue: string) => boolean

type SelectPrimitiveProps = ComponentProps<typeof SelectPrimitive>
type SelectPopoverPlacement = SelectPrimitiveProps["placement"]

// The popper writes its transform origin opposite the resolved side.
const SIDE_FROM_ORIGIN: Record<string, string> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}

// A hidden, always-disabled option kept in Kobalte's collection whenever the
// effective (filtered) collection is empty. Kobalte refuses to open a select
// with zero options (see AGENTS.md / select.tsx), and Autocomplete registers
// its real options only when the popover opens (the SearchField in the popover
// can't be evaluated during SSR/hydration) — so this sentinel lets the first
// open succeed, after which the ListBox registers the real options. It never
// renders: the ListBox shows `renderEmptyState` (or nothing) in place of the
// listbox whenever the collection is empty.
const EMPTY_SENTINEL_ID = "__heroui_autocomplete_empty_sentinel__"
const emptySentinel = {
  id: EMPTY_SENTINEL_ID,
  textValue: "",
  disabled: true,
  render: () => null
} as unknown as ListBoxItemDescriptor

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Context
 * -----------------------------------------------------------------------------------------------*/
type AutocompleteContextValue = {
  slots?: ReturnType<typeof autocompleteVariants>
  setPlacement?: (placement: SelectPopoverPlacement) => void
  mounted?: Accessor<boolean>
  query?: Accessor<string>
  setQuery?: (value: string) => void
  setFilter?: (filter: FilterPredicate | undefined) => void
  setControlledInput?: (
    input:
      | { value: Accessor<string>; onChange?: (value: string) => void }
      | undefined
  ) => void
}

const AutocompleteContext = createContext<AutocompleteContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Root
 * -----------------------------------------------------------------------------------------------*/
interface AutocompleteRootProps extends AutocompleteVariants {
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
  allowsEmptyCollection?: boolean
  class?: string
  children?: JSX.Element
}

const AutocompleteRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AutocompleteRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as AutocompleteRootProps,
    autocompleteVariants.variantKeys,
    [
      "selectionMode",
      "isOpen",
      "defaultOpen",
      "onOpenChange",
      "disabledKeys",
      "value",
      "defaultValue",
      "onChange",
      "isDisabled",
      "isRequired",
      "isInvalid",
      "allowsEmptyCollection",
      "class",
      "children"
    ]
  )

  const slots = createMemo(() => autocompleteVariants(variantProps))
  // Real options registered by the enclosing ListBox (item and section
  // descriptors) once the popover opens; filtered below.
  const [rawOptions, setRawOptions] = createSignal<ListBoxOption[]>([])
  const [query, setQuery] = createSignal("")
  const [filterState, setFilterState] = createSignal<{ fn?: FilterPredicate }>(
    {}
  )
  const [controlledInput, setControlledInput] = createSignal<
    { value: Accessor<string>; onChange?: (value: string) => void } | undefined
  >(undefined)
  const [placement, setPlacement] =
    createSignal<SelectPopoverPlacement>("bottom")
  // Flipped true by a virtualized ListBox in the popover (ListBoxVirtualizeContext);
  // switches the Kobalte Select into virtualized (render-prop windowing) mode.
  const [virtualized, setVirtualized] = createSignal(false)
  const [mounted, setMounted] = createSignal(false)
  onMount(() => {
    setMounted(true)
    setupInteractionModality()
  })

  const isMultiple = () => local.selectionMode === "multiple"
  const disabledKeys = createMemo(() => new Set(local.disabledKeys ?? []))

  // Effective collection: the raw options filtered by the current query. When
  // an external `inputValue` controls the field (Autocomplete.Filter), the
  // consumer supplies pre-filtered items, so filtering is skipped here.
  const filteredOptions = createMemo<ListBoxOption[]>(() => {
    const raw = rawOptions()
    const fn = filterState().fn
    const q = query()
    if (controlledInput() !== undefined || !fn || q === "") {
      return raw
    }
    const result: ListBoxOption[] = []
    for (const option of raw) {
      if (isSectionDescriptor(option)) {
        const items = option.items.filter((item) => fn(item.textValue, q))
        if (items.length > 0) {
          result.push({ ...option, items })
        }
      } else if (fn((option as ListBoxItemDescriptor).textValue, q)) {
        result.push(option)
      }
    }
    return result
  })

  const isCollectionEmpty = () => filteredOptions().length === 0
  const options = createMemo<ListBoxOption[]>(() => {
    const effective = filteredOptions()
    return effective.length > 0 ? effective : [emptySentinel]
  })

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

  // Any Separator(s) the ListBox placed before this item (deferral markers,
  // realized now the popover is open), then the item — mirrors sectionComponent.
  const itemComponent = (
    itemProps: SelectRootItemComponentProps<ListBoxItemDescriptor>
  ) => (
    <>
      {renderDeferred(itemProps.item.rawValue.leading)}
      <ListBoxItemView item={itemProps.item} />
    </>
  )

  const sectionComponent = (
    sectionProps: SelectRootSectionComponentProps<ListBoxSectionDescriptor>
  ) => {
    const descriptor = () => sectionProps.section.rawValue
    return (
      <>
        {renderDeferred(descriptor().leading)}
        <SelectSectionPrimitive
          class={cn(listboxSectionVariants(), descriptor().class)}
          data-slot="list-box-section"
        >
          {renderDeferred(descriptor().header)}
        </SelectSectionPrimitive>
      </>
    )
  }

  const context: AutocompleteContextValue = {
    get slots() {
      return slots()
    },
    setPlacement,
    mounted,
    query,
    setQuery,
    setFilter: (filter) => setFilterState({ fn: filter }),
    setControlledInput
  }

  // Drive the in-popover SearchField. Provided at the root (an ancestor owner of
  // the popover content) rather than inside Autocomplete.Filter: the Filter
  // resolves its children with the `children()` helper, which *creates* the
  // SearchField in the Filter's own owner scope — a provider in the Filter's
  // JSX would be a descendant of that scope and the field would read no context.
  // A controlled `inputValue` (set by Filter) takes precedence over the internal
  // query.
  const searchControl = {
    value: () => controlledInput()?.value() ?? query(),
    onChange: (next: string) => {
      const controlled = controlledInput()
      if (controlled?.onChange) {
        controlled.onChange(next)
      } else {
        setQuery(next)
      }
    }
  }

  return (
    <SelectPrimitive<ListBoxItemDescriptor, ListBoxSectionDescriptor>
      class={cn(slots().base(), local.class)}
      data-slot="autocomplete"
      // Kobalte types `multiple` as a literal, but the runtime takes either;
      // the casts here and on value/defaultValue pin the multiple-mode overload.
      multiple={isMultiple() as true}
      options={options()}
      optionValue="id"
      optionTextValue="textValue"
      optionDisabled={(option: ListBoxItemDescriptor) =>
        option.disabled || disabledKeys().has(option.id)
      }
      optionGroupChildren="items"
      open={local.isOpen}
      defaultOpen={local.defaultOpen}
      // Reset the search query when the popover closes so it reopens unfiltered
      // (mirrors upstream), then delegate to the consumer's handler.
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) {
          setQuery("")
        }
        local.onOpenChange?.(isOpen)
      }}
      value={toOptions(local.value) as ListBoxItemDescriptor[] | undefined}
      defaultValue={
        toOptions(local.defaultValue) as ListBoxItemDescriptor[] | undefined
      }
      onChange={handleChange}
      // Dynamic collection: a no-op reselect must not fire onChange/close on
      // every options() change (see select.tsx). Reselect closes via the
      // popover's activation handlers instead.
      allowDuplicateSelectionEvents={false}
      placement={placement()}
      sameWidth={false}
      virtualized={virtualized()}
      itemComponent={itemComponent}
      sectionComponent={sectionComponent}
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
        <AutocompleteContext.Provider value={context}>
          <ListBoxCollectionContext.Provider value={setRawOptions}>
            <ListBoxEmptyContext.Provider value={isCollectionEmpty}>
              <ListBoxVirtualizeContext.Provider value={setVirtualized}>
                {/* Header/Separator inside the popover's ListBox resolve to
                  deferral markers (not DOM) so registration stays hydration-safe
                  (see AGENTS.md). */}
                <CollectionDeferContext.Provider value={true}>
                  {/* Client-only: renders an <option> per item, but items
                    register only once the popover opens, so hydrating it desyncs
                    keys (see AGENTS.md). */}
                  <Show when={mounted()}>
                    <HiddenSelectPrimitive />
                  </Show>
                  <SearchFieldControlContext.Provider value={searchControl}>
                    {local.children}
                  </SearchFieldControlContext.Provider>
                </CollectionDeferContext.Provider>
              </ListBoxVirtualizeContext.Provider>
            </ListBoxEmptyContext.Provider>
          </ListBoxCollectionContext.Provider>
        </AutocompleteContext.Provider>
      </FieldContext.Provider>
    </SelectPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Trigger
 * -----------------------------------------------------------------------------------------------*/
interface AutocompleteTriggerProps {
  class?: string
  children?: JSX.Element
}

const AutocompleteTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AutocompleteTriggerProps>
) => {
  const [local, rest] = splitProps(props as AutocompleteTriggerProps, ["class"])
  const context = useContext(AutocompleteContext)

  return (
    <SelectTriggerPrimitive
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="autocomplete-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Value
 * -----------------------------------------------------------------------------------------------*/
interface AutocompleteValueSelectedItem {
  key: Key
}

interface AutocompleteValueState {
  selectedItems: AutocompleteValueSelectedItem[]
}

interface AutocompleteValueRenderProps {
  defaultChildren: JSX.Element
  isPlaceholder: boolean
  state: AutocompleteValueState
}

interface AutocompleteValueProps {
  class?: string
  children?:
    | JSX.Element
    | ((props: AutocompleteValueRenderProps) => JSX.Element)
}

const AutocompleteValue = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AutocompleteValueProps>
) => {
  const [local, rest] = splitProps(props as AutocompleteValueProps, [
    "class",
    "children"
  ])
  const context = useContext(AutocompleteContext)

  return (
    <SelectValuePrimitive<ListBoxItemDescriptor>
      class={cn(context.slots?.value(), local.class)}
      data-slot="autocomplete-value"
      {...rest}
    >
      {(state) => {
        const body = local.children
        // Until mounted, mirror SSR's empty selection (options register only on
        // open): a mid-hydration selection settles Kobalte's value memo while
        // the DOM write is dropped, leaving the trigger blank (see AGENTS.md).
        const mounted = context.mounted
        const selectedOptions = () =>
          mounted && !mounted() ? [] : state.selectedOptions()
        if (typeof body === "function") {
          return body({
            get defaultChildren() {
              return selectedOptions()
                .map((option) => option.textValue)
                .join(", ")
            },
            get isPlaceholder() {
              return selectedOptions().length === 0
            },
            state: {
              get selectedItems() {
                return selectedOptions().map((option) => ({ key: option.id }))
              }
            }
          })
        }
        if (body != null) {
          return body
        }
        return selectedOptions()
          .map((option) => option.textValue)
          .join(", ")
      }}
    </SelectValuePrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Clear Button
 * -----------------------------------------------------------------------------------------------*/
const IconClose = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={16}
    role="presentation"
    viewBox="0 0 16 16"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clip-rule="evenodd"
      d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

interface AutocompleteClearButtonProps {
  class?: string
  children?: JSX.Element
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

const AutocompleteClearButton = (props: AutocompleteClearButtonProps) => {
  const [local, rest] = splitProps(props, ["class", "children", "onClick"])
  const context = useContext(AutocompleteContext)
  const selectContext = useSelectContext()
  const isEmpty = () => selectContext.listState().selectionManager().isEmpty()

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
    // Nested inside the trigger button — don't let a clear bubble into the
    // trigger's toggle (which opens on pointer down; stopped there too).
    event.stopPropagation()
    callHandler(event, local.onClick)
    selectContext.listState().selectionManager().clearSelection()
    context.setQuery?.("")
  }

  return (
    <button
      type="button"
      aria-label="Clear selection"
      class={cn(context.slots?.clearButton(), local.class)}
      data-slot="autocomplete-clear-button"
      data-empty={isEmpty() ? "true" : undefined}
      onClick={handleClick}
      onPointerDown={(event) => event.stopPropagation()}
      {...rest}
    >
      {local.children ?? (
        <IconClose data-slot="autocomplete-clear-button-icon" />
      )}
    </button>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Indicator
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

interface AutocompleteIndicatorProps extends ComponentProps<"svg"> {
  class?: string
  children?: JSX.Element
}

const AutocompleteIndicator = (props: AutocompleteIndicatorProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useContext(AutocompleteContext)
  const selectContext = useSelectContext()
  const resolved = children(() => local.children)

  return (
    <Show
      when={resolved()}
      fallback={
        <IconChevronDown
          class={cn(context.slots?.indicator(), local.class)}
          data-open={selectContext.isOpen() ? "true" : undefined}
          data-slot="autocomplete-default-indicator"
          {...rest}
        />
      }
    >
      <span
        class={cn(context.slots?.indicator(), local.class)}
        data-open={selectContext.isOpen() ? "true" : undefined}
        data-slot="autocomplete-indicator"
        {...(rest as unknown as ComponentProps<"span">)}
      >
        {resolved()}
      </span>
    </Show>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Popover
 * -----------------------------------------------------------------------------------------------*/
interface AutocompletePopoverProps {
  class?: string
  children?: JSX.Element
  placement?: SelectPopoverPlacement
}

const AutocompletePopover = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AutocompletePopoverProps>
) => {
  const [local, rest] = splitProps(
    props as AutocompletePopoverProps & {
      ref?: HTMLElement | ((el: HTMLElement) => void)
      onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
      onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
    },
    ["class", "children", "placement", "ref", "onClick", "onKeyDown"]
  )
  const context = useContext(AutocompleteContext)
  const selectContext = useSelectContext()
  const [contentEl, setContentEl] = createSignal<HTMLElement>()

  // Duplicate selection events are disabled on the root, so Kobalte's
  // closeOnSelection never sees a reselect — close on option activation here
  // (clicks and Enter with a highlighted item), same as select.tsx.
  const closeOnActivation = (option: Element | null | undefined) => {
    if (!option || selectContext.isMultiple()) {
      return
    }
    if (option.getAttribute("aria-disabled") !== "true") {
      selectContext.close()
    }
  }
  const [resolvedSide, setResolvedSide] = createSignal<string>()

  createComputed(() => {
    if (local.placement) {
      context.setPlacement?.(local.placement)
    }
  })

  // Kobalte's Select omits onCurrentPlacementChange; mirror the popper-resolved
  // side (viewport flips) into the data-placement attribute upstream's
  // directional animations key off (see select.tsx).
  createEffect(() => {
    const positioner = contentEl()?.parentElement
    if (!positioner) return
    const update = () => {
      const origin = positioner.style.getPropertyValue(
        "--kb-popper-content-transform-origin"
      )
      setResolvedSide(SIDE_FROM_ORIGIN[origin.trim().split(" ")[0] ?? ""])
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(positioner, { attributeFilter: ["style"] })
    onCleanup(() => observer.disconnect())
  })

  return (
    <SurfaceContext.Provider value={{ variant: "default" }}>
      <SelectPortalPrimitive>
        <SelectContentPrimitive
          ref={mergeRefs(setContentEl, local.ref)}
          class={cn(context.slots?.popover(), local.class)}
          data-slot="autocomplete-popover"
          data-placement={
            resolvedSide() ?? (local.placement ?? "bottom").split("-")[0]
          }
          onClick={(
            event: MouseEvent & { currentTarget: HTMLElement; target: Element }
          ) => {
            callHandler(event, local.onClick)
            closeOnActivation(event.target.closest("[data-slot=list-box-item]"))
          }}
          onKeyDown={(
            event: KeyboardEvent & {
              currentTarget: HTMLElement
              target: Element
            }
          ) => {
            callHandler(event, local.onKeyDown)
            if (event.key === "Enter") {
              closeOnActivation(
                contentEl()?.querySelector(
                  "[data-slot=list-box-item][data-highlighted]"
                )
              )
            }
          }}
          {...rest}
        >
          {/* Behind Kobalte's `contentPresent` gate: nothing here renders while
              the popover is closed, so the SearchField/ListBox never create DOM
              during SSR/hydration (see AGENTS.md). */}
          <PreventScroll />
          <div
            class={cn(context.slots?.popoverDialog())}
            data-slot="autocomplete-popover-dialog"
            tabindex={-1}
          >
            {local.children}
          </div>
        </SelectContentPrimitive>
      </SelectPortalPrimitive>
    </SurfaceContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Filter
 * -----------------------------------------------------------------------------------------------*/
interface AutocompleteFilterProps {
  class?: string
  filter?: FilterPredicate
  inputValue?: string
  onInputChange?: (value: string) => void
  children?: JSX.Element
}

const AutocompleteFilter = (props: AutocompleteFilterProps) => {
  const [local, rest] = splitProps(props, [
    "class",
    "filter",
    "inputValue",
    "onInputChange",
    "children"
  ])
  const context = useContext(AutocompleteContext)

  const isControlled = () => local.inputValue !== undefined

  // Feed the filter predicate + controlled-input state up to the root. Runs
  // only while the popover is open (this component renders behind Kobalte's
  // content gate), which is exactly when filtering matters.
  createComputed(() => context.setFilter?.(local.filter))
  createComputed(() => {
    context.setControlledInput?.(
      isControlled()
        ? { value: () => local.inputValue ?? "", onChange: local.onInputChange }
        : undefined
    )
    onCleanup(() => context.setControlledInput?.(undefined))
  })

  // The ListBox inside resolves to a render marker (root provides the collection
  // context); realize it here now the popover is open. The SearchField is driven
  // by the root-level SearchFieldControlContext (see AutocompleteRoot).
  const resolved = children(() => local.children)

  return (
    <div
      class={cn(context.slots?.filter(), local.class)}
      data-slot="autocomplete-filter"
      {...rest}
    >
      <For each={resolved.toArray()}>
        {(child) => (isListBoxRenderMarker(child) ? child.render() : child)}
      </For>
    </div>
  )
}

export type {
  AutocompleteClearButtonProps,
  AutocompleteContextValue,
  AutocompleteFilterProps,
  AutocompleteIndicatorProps,
  AutocompletePopoverProps,
  AutocompleteRootProps,
  AutocompleteTriggerProps,
  AutocompleteValueProps,
  AutocompleteValueRenderProps,
  AutocompleteValueState
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  AutocompleteClearButton,
  AutocompleteContext,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue
}
