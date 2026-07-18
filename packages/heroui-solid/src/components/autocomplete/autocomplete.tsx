import {
  type AutocompleteVariants,
  autocompleteVariants,
  cn,
  listboxSectionVariants
} from "@heroui/styles"
import { Root as ListboxRootPrimitive } from "@kobalte/core/listbox"
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
  isDeferredNode,
  renderDeferred,
  useCollectionDefer
} from "../../utils/collection-defer"
import { FieldContext } from "../../utils/field-context"
import { setupInteractionModality } from "../../utils/interaction-modality"
import { PreventScroll } from "../../utils/prevent-scroll"
import {
  isListBoxRenderMarker,
  isSectionDescriptor,
  ListBoxCollectionContext,
  ListBoxCollectionListboxContext,
  ListBoxEmptyContext,
  type ListBoxItemDescriptor,
  ListBoxItemView,
  type ListBoxOption,
  type ListBoxSectionDescriptor,
  ListBoxVirtualizeContext
} from "../list-box/list-box"
import {
  SearchFieldControlContext,
  type SearchFieldControlContextValue
} from "../search-field/search-field"
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
// with zero options (see AGENTS.md / select.tsx), so the sentinel keeps the
// filtered-to-nothing case openable. It never renders: the ListBox shows
// `renderEmptyState` (or nothing) in place of the listbox whenever the
// collection is empty.
const EMPTY_SENTINEL_ID = "__heroui_autocomplete_empty_sentinel__"
const emptySentinel = {
  id: EMPTY_SENTINEL_ID,
  textValue: "",
  disabled: true,
  render: () => null
} as unknown as ListBoxItemDescriptor

// Realizes a popover child resolved during the closed popover's eager pass: the
// ListBox is a render marker and the Filter/SearchField are deferral markers
// (both DOM-free until the popover opens), everything else passes through.
const renderPopoverChild = (child: unknown): JSX.Element =>
  isListBoxRenderMarker(child)
    ? child.render()
    : isDeferredNode(child)
      ? child.render()
      : (child as JSX.Element)

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Listbox (virtual focus)
 * -----------------------------------------------------------------------------------------------*/
// The collection listbox rendered in the popover. Kobalte's own `Select.Listbox`
// hardcodes DOM focus (it omits `shouldUseVirtualFocus`), which would pull focus
// off the SearchField on hover/navigation. Autocomplete mirrors React Aria's
// virtual focus instead: the SearchField keeps DOM focus and points
// `aria-activedescendant` at the highlighted option (see AutocompleteSearchBridge),
// so this listbox is Kobalte's generic Listbox sharing the Select's list state
// with `shouldUseVirtualFocus`. Provided to the ListBox via
// ListBoxCollectionListboxContext. Otherwise a copy of Kobalte's SelectListbox.
interface AutocompleteListboxProps {
  ref?: HTMLElement | ((el: HTMLElement) => void)
  id?: string
  class?: string
  onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
  scrollToItem?: (key: string) => void
  children?: unknown
}

const AutocompleteListbox = (props: AutocompleteListboxProps) => {
  const context = useSelectContext()
  const [local, others] = splitProps(props, ["ref", "id", "onKeyDown"])
  const listboxId = local.id ?? context.generateId("listbox")
  createEffect(() => onCleanup(context.registerListboxId(listboxId)))

  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (event) => {
    callHandler(
      event,
      local.onKeyDown as JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
    )
    // Prevent createSelectableCollection from clearing the selection on Escape.
    if (event.key === "Escape") {
      event.preventDefault()
    }
  }

  return (
    <ListboxRootPrimitive
      ref={mergeRefs(context.setListboxRef, local.ref)}
      id={listboxId}
      state={context.listState()}
      virtualized={context.isVirtualized()}
      // No initial DOM/virtual focus grab: the SearchField owns focus and no
      // option is highlighted until the user navigates.
      autoFocus={false}
      shouldUseVirtualFocus
      shouldSelectOnPressUp
      shouldFocusOnHover
      shouldFocusWrap={context.shouldFocusWrap()}
      disallowTypeAhead={context.disallowTypeAhead()}
      aria-labelledby={context.listboxAriaLabelledBy()}
      renderItem={context.renderItem}
      renderSection={context.renderSection}
      onKeyDown={onKeyDown}
      {...(others as Record<string, unknown>)}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Autocomplete Search Bridge (virtual focus controller)
 * -----------------------------------------------------------------------------------------------*/
// Rendered inside the Kobalte Select (so it can read the shared list state) and
// provides the SearchFieldControlContext the in-popover SearchField binds to.
// Beyond value/onChange it wires React-Aria-style virtual focus: ArrowUp/Down/
// Home/End move a highlight through the (filtered) options via the selection
// manager's focused key, `aria-activedescendant` on the input points at the
// active option, and Enter selects/toggles it — all while the input keeps DOM
// focus so typing keeps filtering.
interface AutocompleteSearchBridgeProps {
  searchControl: { value: () => string; onChange: (value: string) => void }
  children: JSX.Element
}

const AutocompleteSearchBridge = (props: AutocompleteSearchBridgeProps) => {
  const context = useSelectContext()
  // `inputEl` is a signal, not a plain ref: the SearchField mounts a beat after
  // the popover opens, so effects that observe the popover DOM must re-run once
  // the input actually lands (see the DOM-revision observer below).
  const [inputEl, setInputEl] = createSignal<HTMLInputElement>()
  const manager = () => context.listState().selectionManager()

  // Enabled, selectable option keys in document order (skips sections, disabled
  // items, and the empty sentinel).
  const enabledKeys = () => {
    const keys: string[] = []
    for (const node of context.listState().collection()) {
      if (
        node.type === "item" &&
        !node.disabled &&
        node.key !== EMPTY_SENTINEL_ID
      ) {
        keys.push(node.key)
      }
    }
    return keys
  }

  // Match by data-key iteration rather than an attribute selector so arbitrary
  // option keys need no CSS escaping (and jsdom, which lacks CSS.escape, works).
  const optionEl = (key: string): HTMLElement | undefined => {
    const content = inputEl()?.closest("[data-slot=autocomplete-popover]")
    if (!content) {
      return undefined
    }
    for (const el of content.querySelectorAll<HTMLElement>(
      "[data-slot=list-box-item]"
    )) {
      if (el.getAttribute("data-key") === key) {
        return el
      }
    }
    return undefined
  }

  const focusKey = (key: string | undefined) => {
    manager().setFocused(true)
    manager().setFocusedKey(key)
    if (key) {
      // Optional call: jsdom doesn't implement scrollIntoView.
      optionEl(key)?.scrollIntoView?.({ block: "nearest" })
    }
  }

  // Re-resolve the active option element whenever the popover DOM changes, not
  // only when the focused key changes. In the virtualized listbox the focused
  // option often isn't rendered at the instant focus moves — a jump (Home/End)
  // or a far step scrolls the virtualizer, which re-windows and mounts the
  // focused row a frame later. Observing the popover's child list bumps this
  // revision so `aria-activedescendant`/highlight re-resolve once the row
  // mounts. (Kobalte's own combobox resolves activedescendant by the same DOM
  // query, and Kobalte option ids carry a createUniqueId(), so the id can't be
  // derived from the key ahead of render.)
  const [domRevision, setDomRevision] = createSignal(0)
  createEffect(() => {
    if (!context.isOpen()) {
      return
    }
    const content = inputEl()?.closest("[data-slot=autocomplete-popover]")
    if (!content) {
      return
    }
    const observer = new MutationObserver(() => setDomRevision((r) => r + 1))
    observer.observe(content, { childList: true, subtree: true })
    onCleanup(() => observer.disconnect())
  })

  const activeDescendant = () => {
    domRevision()
    const key = manager().focusedKey()
    return key != null ? optionEl(key)?.id : undefined
  }

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (!context.isOpen()) {
      return
    }
    const keys = enabledKeys()
    const current = manager().focusedKey()
    const index = current != null ? keys.indexOf(current) : -1
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        focusKey(
          index < 0 ? keys[0] : keys[Math.min(index + 1, keys.length - 1)]
        )
        break
      case "ArrowUp":
        event.preventDefault()
        focusKey(
          index < 0 ? keys[keys.length - 1] : keys[Math.max(index - 1, 0)]
        )
        break
      case "Home":
        event.preventDefault()
        focusKey(keys[0])
        break
      case "End":
        event.preventDefault()
        focusKey(keys[keys.length - 1])
        break
      case "Enter": {
        const key = manager().focusedKey()
        if (key != null && keys.includes(key)) {
          event.preventDefault()
          if (context.isMultiple()) {
            manager().toggleSelection(key)
          } else {
            manager().select(key)
            context.close()
          }
        }
        break
      }
      case "Escape":
        event.preventDefault()
        context.close()
        break
    }
  }

  // Clear the virtual highlight whenever the popover (re)opens or the query
  // changes — filtered options may have shifted, so navigation restarts.
  createEffect(() => {
    context.isOpen()
    props.searchControl.value()
    manager().setFocusedKey(undefined)
  })

  const control: SearchFieldControlContextValue = {
    value: () => props.searchControl.value(),
    onChange: (next) => props.searchControl.onChange(next),
    registerInput: (el) => {
      setInputEl(el)
    },
    onInputKeyDown,
    inputAria: () => ({
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-haspopup": "listbox",
      "aria-expanded": context.isOpen(),
      "aria-controls": context.isOpen() ? context.listboxId() : undefined,
      "aria-activedescendant": activeDescendant()
    })
  }

  return (
    <SearchFieldControlContext.Provider value={control}>
      {props.children}
    </SearchFieldControlContext.Provider>
  )
}

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
  // descriptors) during the popover's eager pass — even while closed, so the
  // trigger can resolve a preselected value's label; filtered below.
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
                {/* The popover's ListBox renders through a virtual-focus listbox
                  so the SearchField keeps DOM focus during keyboard nav. */}
                <ListBoxCollectionListboxContext.Provider
                  value={AutocompleteListbox}
                >
                  {/* Header/Separator inside the popover's ListBox resolve to
                    deferral markers (not DOM) so the closed popover's eager
                    option registration stays hydration-safe (see AGENTS.md). */}
                  <CollectionDeferContext.Provider value={true}>
                    {/* Client-only: renders an <option> per item, but items
                      register after the server snapshots the collection, so
                      hydrating it desyncs keys (see AGENTS.md). */}
                    <Show when={mounted()}>
                      <HiddenSelectPrimitive />
                    </Show>
                    {/* Bridges the in-popover SearchField to the Select's list
                      state (value + virtual-focus keyboard nav). Rendered here,
                      inside the Kobalte Select, so it can read the shared state;
                      provides SearchFieldControlContext to the popover. */}
                    <AutocompleteSearchBridge searchControl={searchControl}>
                      {local.children}
                    </AutocompleteSearchBridge>
                  </CollectionDeferContext.Provider>
                </ListBoxCollectionListboxContext.Provider>
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
        // Until mounted, mirror SSR's empty selection: the server freezes the
        // collection empty (memos never re-run), so a mid-hydration selection
        // settles Kobalte's value memo while the DOM write is dropped, leaving
        // the trigger blank (see AGENTS.md). After mount the eagerly-registered
        // options resolve the selected label even while closed.
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

  // Resolve children eagerly so the ListBox registers its option descriptors
  // while the popover is still closed (Kobalte refuses to open a zero-option
  // select, and the trigger must resolve a preselected value's label before the
  // popover ever opens). The Filter/SearchField/ListBox all resolve to markers,
  // not DOM, so the closed popover creates nothing during SSR/hydration; their
  // render() runs below, inside the content, once the popover actually opens.
  const resolved = children(() => local.children)

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
              during SSR/hydration (see AGENTS.md). The eagerly-resolved markers'
              render() runs only here, once the popover is open. */}
          <PreventScroll />
          <div
            class={cn(context.slots?.popoverDialog())}
            data-slot="autocomplete-popover-dialog"
            tabindex={-1}
          >
            <For each={resolved.toArray()}>
              {(child) => renderPopoverChild(child)}
            </For>
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

  // Feed the filter predicate + controlled-input state up to the root. These run
  // during the popover's eager pass (below) as well as when it is open; both are
  // harmless while closed (the query is empty).
  createComputed(() => context.setFilter?.(local.filter))
  createComputed(() => {
    context.setControlledInput?.(
      isControlled()
        ? { value: () => local.inputValue ?? "", onChange: local.onInputChange }
        : undefined
    )
    onCleanup(() => context.setControlledInput?.(undefined))
  })

  // Resolve children eagerly (while the popover is still closed) so the enclosed
  // ListBox registers its option descriptors: the ListBox resolves to a render
  // marker and the SearchField to a deferral marker (both DOM-free). The Filter
  // itself resolves to a deferral marker so its own wrapper DOM is not created
  // until the popover opens — its render() runs inside the open content (see
  // AGENTS.md). The SearchField is driven by SearchFieldControlContext (see
  // AutocompleteSearchBridge).
  const resolved = children(() => local.children)

  const rendered = () => (
    <div
      class={cn(context.slots?.filter(), local.class)}
      data-slot="autocomplete-filter"
      {...rest}
    >
      <For each={resolved.toArray()}>
        {(child) => renderPopoverChild(child)}
      </For>
    </div>
  )

  const deferred = useCollectionDefer(rendered)
  return (deferred ?? rendered()) as unknown as JSX.Element
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
