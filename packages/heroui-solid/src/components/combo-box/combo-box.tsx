import {
  type ComboBoxVariants,
  cn,
  comboBoxVariants,
  listboxSectionVariants
} from "@heroui/styles"
import {
  Content as ComboboxContentPrimitive,
  Control as ComboboxControlPrimitive,
  HiddenSelect as ComboboxHiddenSelectPrimitive,
  Listbox as ComboboxListboxPrimitive,
  Portal as ComboboxPortalPrimitive,
  Root as ComboboxPrimitive,
  type ComboboxRootItemComponentProps,
  type ComboboxRootSectionComponentProps,
  Section as ComboboxSectionPrimitive,
  Trigger as ComboboxTriggerPrimitive,
  useComboboxContext
} from "@kobalte/core/combobox"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeRefs } from "@kobalte/utils"
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
import { dataAttr } from "../../utils/assertion"
import {
  CollectionDeferContext,
  renderDeferred
} from "../../utils/collection-defer"
import { setupInteractionModality } from "../../utils/interaction-modality"
import { PreventScroll } from "../../utils/prevent-scroll"
import {
  isListBoxRenderMarker,
  isSectionDescriptor,
  ListBoxCollectionContext,
  ListBoxCollectionListboxContext,
  type ListBoxItemDescriptor,
  ListBoxItemView,
  type ListBoxOption,
  type ListBoxSectionDescriptor
} from "../list-box/list-box"
import { SurfaceContext } from "../surface/surface"
import { TextFieldContext } from "../textfield"

type Key = string
type FilterPredicate = (textValue: string, inputValue: string) => boolean

type ComboboxPrimitiveProps = ComponentProps<typeof ComboboxPrimitive>
type ComboBoxPopoverPlacement = ComboboxPrimitiveProps["placement"]

// The popper writes its transform origin opposite the resolved side.
const SIDE_FROM_ORIGIN: Record<string, string> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}

/* -------------------------------------------------------------------------------------------------
 * ComboBox Input Context
 * -----------------------------------------------------------------------------------------------*/
// Provided by ComboBox.InputGroup; consumed by our Input so it renders as
// Kobalte's ComboboxInput (wiring the filter text + a11y) instead of a plain
// text-field input. Absent when the Input is used standalone.
const ComboBoxInputContext = createContext<boolean>(false)

/* -------------------------------------------------------------------------------------------------
 * ComboBox Context
 * -----------------------------------------------------------------------------------------------*/
type ComboBoxContextValue = {
  slots?: ReturnType<typeof comboBoxVariants>
  setPlacement?: (placement: ComboBoxPopoverPlacement) => void
  mounted?: Accessor<boolean>
}

const ComboBoxContext = createContext<ComboBoxContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * ComboBox Root
 * -----------------------------------------------------------------------------------------------*/
interface ComboBoxRootProps extends ComboBoxVariants {
  inputValue?: string
  defaultInputValue?: string
  onInputChange?: (value: string) => void
  selectedKey?: Key | null
  defaultSelectedKey?: Key | null
  onSelectionChange?: (key: Key | null) => void
  disabledKeys?: Iterable<Key>
  defaultFilter?: FilterPredicate
  allowsCustomValue?: boolean
  allowsEmptyCollection?: boolean
  menuTrigger?: "focus" | "input" | "manual"
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  name?: string
  // Inert: combo-box.css has no `variant` styling. Accepted (and forwarded to
  // the inner Input's variant, e.g. `secondary` on a Surface) but it does not
  // drive comboBoxVariants.
  variant?: "primary" | "secondary"
  class?: string
  children?: JSX.Element
}

const ComboBoxRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboBoxRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as ComboBoxRootProps,
    comboBoxVariants.variantKeys,
    [
      "inputValue",
      "defaultInputValue",
      "onInputChange",
      "selectedKey",
      "defaultSelectedKey",
      "onSelectionChange",
      "disabledKeys",
      "defaultFilter",
      "allowsCustomValue",
      "allowsEmptyCollection",
      "menuTrigger",
      "isDisabled",
      "isReadOnly",
      "isRequired",
      "isInvalid",
      "name",
      "variant",
      "class",
      "children"
    ]
  )

  const slots = createMemo(() => comboBoxVariants(variantProps))
  // Options are item and section descriptors registered by the enclosing
  // ListBox; sections group their items via Kobalte's `optionGroupChildren`.
  const [options, setOptions] = createSignal<ListBoxOption[]>([])

  // Controlled open state. Kobalte's "focus" triggerMode re-opens the menu
  // whenever the input receives focus — including the focus it *programmatically*
  // restores to the input after a selection (combobox-base resetInputValue) or
  // after an outside dismissal (its focus scope). React Aria's menuTrigger
  // "focus" only opens on genuine user focus, so upstream stays closed in both
  // cases; Kobalte instead flickers closed→open→closed on select and reopens on
  // click-outside. We veto the focus-driven re-open that fires in the same tick
  // as a close, while a real user focus (never same-tick as a close) still opens.
  const [open, setOpen] = createSignal(false)
  // React Aria shows every option when the menu opens and only narrows once the
  // user edits the input; Kobalte's combobox instead filters by the current
  // input on every open, so a re-opened combobox shows only its selected label.
  // Track "show all" ourselves: true whenever the menu opens, false as soon as
  // the input text changes (typing, or the programmatic reset on selection —
  // harmless there since the menu is closing and the next open re-arms it).
  const [showAll, setShowAll] = createSignal(true)
  let vetoFocusReopen = false
  const handleOpenChange = (isOpen: boolean, triggerMode?: string) => {
    if (!isOpen) {
      setOpen(false)
      vetoFocusReopen = true
      queueMicrotask(() => {
        vetoFocusReopen = false
      })
      return
    }
    if (vetoFocusReopen && triggerMode === "focus") return
    // A focus/manual open shows the full collection; an "input" open is the user
    // typing, which must keep the just-applied filter (onInputChange already
    // cleared showAll and fires before this open).
    if (triggerMode !== "input") setShowAll(true)
    setOpen(true)
  }
  const [placement, setPlacement] =
    createSignal<ComboBoxPopoverPlacement>("bottom")
  const [mounted, setMounted] = createSignal(false)
  onMount(() => {
    setMounted(true)
    setupInteractionModality()
  })

  const disabledKeys = createMemo(() => new Set(local.disabledKeys ?? []))
  // Kobalte's combobox `filteredOptions` assumes every top-level option is a
  // group the moment `optionGroupChildren` is set — it reads `option.items`
  // unconditionally and `.filter`s it, crashing on a plain item descriptor
  // (no `items`). Its Select counterpart tolerates mixed collections; the
  // combobox doesn't. Upstream ComboBox collections are either all-flat or
  // all-section, so only enable grouping once a Section actually registers.
  const hasSections = createMemo(() => options().some(isSectionDescriptor))

  // Kobalte's value API is option objects; it only ever reads `optionValue`
  // off controlled values, so keys wrap as bare {id} stubs.
  const toOption = (key: Key) => ({ id: key }) as ListBoxItemDescriptor
  const toValue = (key: Key | null | undefined) =>
    key == null ? key : toOption(key)

  const containsFilter = (textValue: string, inputValue: string) =>
    textValue.toLowerCase().includes(inputValue.toLowerCase())

  // Kobalte's defaultFilter passes the option object; upstream's predicate takes
  // the text value, so unwrap to `textValue` before delegating.
  const filter = (option: ListBoxItemDescriptor, inputValue: string) => {
    if (showAll() || !inputValue) return true
    return local.defaultFilter
      ? local.defaultFilter(option.textValue, inputValue)
      : containsFilter(option.textValue, inputValue)
  }

  // Any Separator(s) the ListBox placed before this item (deferral markers,
  // realized now the popover is open), then the item — mirrors sectionComponent.
  const itemComponent = (
    itemProps: ComboboxRootItemComponentProps<ListBoxItemDescriptor>
  ) => (
    <>
      {renderDeferred(itemProps.item.rawValue.leading)}
      <ListBoxItemView item={itemProps.item} />
    </>
  )

  // Renders a section's label row: any Separator(s) the ListBox placed before
  // it, then the header. Both are deferral markers here (their DOM was held
  // back during registration), realized now that the popover is open.
  const sectionComponent = (
    sectionProps: ComboboxRootSectionComponentProps<ListBoxSectionDescriptor>
  ) => {
    const descriptor = () => sectionProps.section.rawValue
    return (
      <>
        {renderDeferred(descriptor().leading)}
        <ComboboxSectionPrimitive
          class={cn(listboxSectionVariants(), descriptor().class)}
          data-slot="list-box-section"
        >
          {renderDeferred(descriptor().header)}
        </ComboboxSectionPrimitive>
      </>
    )
  }

  return (
    <ComboboxPrimitive<ListBoxItemDescriptor, ListBoxSectionDescriptor>
      class={cn(slots().base(), local.class)}
      data-slot="combo-box"
      options={options()}
      optionValue="id"
      optionTextValue="textValue"
      // Kobalte writes the selected option's label into the input on selection
      // (resetInputValue); label off the text value so the input shows "Cat",
      // not the key "cat".
      optionLabel="textValue"
      optionDisabled={(option: ListBoxItemDescriptor) =>
        option.disabled || disabledKeys().has(option.id)
      }
      optionGroupChildren={hasSections() ? "items" : undefined}
      value={toValue(local.selectedKey) as ListBoxItemDescriptor | undefined}
      defaultValue={
        toValue(local.defaultSelectedKey) as ListBoxItemDescriptor | undefined
      }
      onChange={(option: ListBoxItemDescriptor | null) =>
        local.onSelectionChange?.(option?.id ?? null)
      }
      onInputChange={(value: string) => {
        setShowAll(false)
        local.onInputChange?.(value)
      }}
      // Upstream `allowsCustomValue` ≈ Kobalte's `noResetInputOnBlur`: a typed
      // value with no matching option is kept on blur instead of being cleared.
      noResetInputOnBlur={local.allowsCustomValue}
      allowsEmptyCollection={local.allowsEmptyCollection}
      triggerMode={local.menuTrigger ?? "focus"}
      open={open()}
      onOpenChange={handleOpenChange}
      defaultFilter={filter}
      placement={placement()}
      // Kobalte defaults sameWidth: true (pins the popover to the trigger's
      // exact width); upstream only enforces a min-width, so long labels widen
      // the popover instead of wrapping (see combo-box.overrides.css).
      sameWidth={false}
      itemComponent={itemComponent}
      sectionComponent={sectionComponent}
      validationState={local.isInvalid ? "invalid" : undefined}
      disabled={local.isDisabled}
      readOnly={local.isReadOnly}
      required={local.isRequired}
      name={local.name}
      // HeroUI CSS matches explicit data-*="true" values; Kobalte stamps empty
      // strings, so re-stamp here (rest spreads after Kobalte's dataset).
      data-invalid={dataAttr(local.isInvalid)}
      data-required={dataAttr(local.isRequired)}
      data-disabled={dataAttr(local.isDisabled)}
      data-readonly={dataAttr(local.isReadOnly)}
      {...rest}
    >
      <TextFieldContext.Provider value={{ variant: local.variant }}>
        <ComboBoxContext.Provider
          value={{
            get slots() {
              return slots()
            },
            setPlacement,
            mounted
          }}
        >
          <ListBoxCollectionContext.Provider value={setOptions}>
            <ListBoxCollectionListboxContext.Provider
              value={ComboboxListboxPrimitive}
            >
              {/* Header/Separator inside the popover's ListBox resolve to
                    deferral markers (not DOM) so the closed popover's eager
                    option registration stays hydration-safe (see AGENTS.md). */}
              <CollectionDeferContext.Provider value={true}>
                <ComboBoxController
                  inputValue={local.inputValue}
                  defaultInputValue={local.defaultInputValue}
                />
                {/* Client-only: it renders an <option> per item, but items
                      register after Kobalte snapshots them on the server (SSR
                      memos never re-run), so hydrating it desyncs keys. */}
                <Show when={mounted()}>
                  <ComboboxHiddenSelectPrimitive />
                </Show>
                {local.children}
              </CollectionDeferContext.Provider>
            </ListBoxCollectionListboxContext.Provider>
          </ListBoxCollectionContext.Provider>
        </ComboBoxContext.Provider>
      </TextFieldContext.Provider>
    </ComboboxPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ComboBox Input Value Controller
 * -----------------------------------------------------------------------------------------------*/
// Kobalte's combobox keeps `inputValue` internal (no controlled prop), so bridge
// it here from inside the Kobalte context: seed `defaultInputValue` once and
// push a controlled `inputValue` on every change. Renders no DOM (effects are
// client-only), so it stays hydration-inert.
const ComboBoxController = (props: {
  inputValue?: string
  defaultInputValue?: string
}) => {
  const context = useComboboxContext()
  onMount(() => {
    if (props.inputValue === undefined && props.defaultInputValue != null) {
      context.setInputValue(props.defaultInputValue)
    }
  })
  createEffect(() => {
    if (props.inputValue !== undefined) {
      context.setInputValue(props.inputValue)
    }
  })
  return null
}

/* -------------------------------------------------------------------------------------------------
 * ComboBox Input Group
 * -----------------------------------------------------------------------------------------------*/
interface ComboBoxInputGroupProps {
  class?: string
  children?: JSX.Element
}

const ComboBoxInputGroup = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboBoxInputGroupProps>
) => {
  const [local, rest] = splitProps(props as ComboBoxInputGroupProps, [
    "class",
    "children"
  ])
  const context = useContext(ComboBoxContext)

  return (
    <ComboboxControlPrimitive
      class={cn(context.slots?.inputGroup(), local.class)}
      data-slot="combo-box-input-group"
      {...rest}
    >
      <ComboBoxInputContext.Provider value={true}>
        {local.children}
      </ComboBoxInputContext.Provider>
    </ComboboxControlPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ComboBox Trigger
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

interface ComboBoxTriggerProps {
  class?: string
  children?: JSX.Element
}

const ComboBoxTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ComboBoxTriggerProps>
) => {
  const [local, rest] = splitProps(props as ComboBoxTriggerProps, [
    "class",
    "children"
  ])
  const context = useContext(ComboBoxContext)
  const comboboxContext = useComboboxContext()
  const resolved = children(() => local.children)

  return (
    <ComboboxTriggerPrimitive
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="combo-box-trigger"
      // Kobalte stamps data-expanded/data-closed; the trigger's chevron rotation
      // keys off data-open, so bridge it here (rest spreads after the dataset).
      data-open={dataAttr(comboboxContext.isOpen())}
      {...rest}
    >
      <Show
        when={resolved()}
        fallback={
          <IconChevronDown data-slot="combo-box-trigger-default-icon" />
        }
      >
        {resolved()}
      </Show>
    </ComboboxTriggerPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ComboBox Popover
 * -----------------------------------------------------------------------------------------------*/
interface ComboBoxPopoverProps {
  class?: string
  children?: JSX.Element
  placement?: ComboBoxPopoverPlacement
}

const ComboBoxPopover = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ComboBoxPopoverProps>
) => {
  const [local, rest] = splitProps(
    props as ComboBoxPopoverProps & {
      ref?: HTMLElement | ((el: HTMLElement) => void)
    },
    ["class", "children", "placement", "ref"]
  )
  const context = useContext(ComboBoxContext)
  const [contentEl, setContentEl] = createSignal<HTMLElement>()
  const [resolvedSide, setResolvedSide] = createSignal<string>()

  createComputed(() => {
    if (local.placement) {
      context.setPlacement?.(local.placement)
    }
  })

  // Kobalte's Combobox omits onCurrentPlacementChange, so the popper-resolved
  // side (which reflects viewport flips) is only observable through the
  // transform-origin var written on the positioner — mirror it into the
  // data-placement attribute upstream's directional animations key off.
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

  // Resolve children eagerly so the ListBox registers its items before the
  // content mounts (Kobalte refuses to open a combobox with zero options). The
  // ListBox resolves to a render marker, not DOM; its render() only runs below,
  // inside the content, once the popover actually opens.
  const resolved = children(() => local.children)

  return (
    <SurfaceContext.Provider value={{ variant: "default" }}>
      <ComboboxPortalPrimitive>
        <ComboboxContentPrimitive
          ref={mergeRefs(setContentEl, local.ref)}
          class={cn(context.slots?.popover(), local.class)}
          data-slot="combo-box-popover"
          data-placement={
            resolvedSide() ?? (local.placement ?? "bottom").split("-")[0]
          }
          // Kobalte's focus scope refocuses the input on every close; with
          // triggerMode "focus" that refires the open, so clicking outside can
          // never keep the popover closed. React Aria never restores focus to
          // the input on close — suppress it here (selection refocuses the
          // input directly; Escape leaves the already-focused input untouched).
          onCloseAutoFocus={(e) => e.preventDefault()}
          {...rest}
        >
          <PreventScroll />
          <For each={resolved.toArray()}>
            {(child) => (isListBoxRenderMarker(child) ? child.render() : child)}
          </For>
        </ComboboxContentPrimitive>
      </ComboboxPortalPrimitive>
    </SurfaceContext.Provider>
  )
}

export type {
  ComboBoxContextValue,
  ComboBoxInputGroupProps,
  ComboBoxPopoverProps,
  ComboBoxRootProps,
  ComboBoxTriggerProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  ComboBoxContext,
  ComboBoxInputContext,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger
}
