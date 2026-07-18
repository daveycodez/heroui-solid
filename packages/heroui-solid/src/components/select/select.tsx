import {
  cn,
  listboxSectionVariants,
  type SelectVariants,
  selectVariants
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
  ListBoxCollectionContext,
  type ListBoxItemDescriptor,
  ListBoxItemView,
  type ListBoxOption,
  type ListBoxSectionDescriptor
} from "../list-box/list-box"
import { SurfaceContext } from "../surface/surface"

type Key = string

type SelectPrimitiveProps = ComponentProps<typeof SelectPrimitive>
type SelectPopoverPlacement = SelectPrimitiveProps["placement"]

// The popper writes its transform origin opposite the resolved side.
const SIDE_FROM_ORIGIN: Record<string, string> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}

/* -------------------------------------------------------------------------------------------------
 * Select Context
 * -----------------------------------------------------------------------------------------------*/
type SelectContextValue = {
  slots?: ReturnType<typeof selectVariants>
  setPlacement?: (placement: SelectPopoverPlacement) => void
  mounted?: Accessor<boolean>
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
  // Options are item and section descriptors registered by the enclosing
  // ListBox; sections group their items via Kobalte's `optionGroupChildren`.
  const [options, setOptions] = createSignal<ListBoxOption[]>([])
  const [placement, setPlacement] =
    createSignal<SelectPopoverPlacement>("bottom")
  const [mounted, setMounted] = createSignal(false)
  onMount(() => {
    setMounted(true)
    setupInteractionModality()
  })

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

  // Renders a section's label row: any Separator(s) the ListBox placed before
  // it, then the header. Both are deferral markers here (their DOM was held
  // back during registration), realized now that the popover is open.
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

  return (
    <SelectPrimitive<ListBoxItemDescriptor, ListBoxSectionDescriptor>
      class={cn(slots().base(), local.class)}
      data-slot="select"
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
      value={toOptions(local.value) as ListBoxItemDescriptor[] | undefined}
      defaultValue={
        toOptions(local.defaultValue) as ListBoxItemDescriptor[] | undefined
      }
      onChange={handleChange}
      // Kobalte's deferred prune-selection effect rewrites the selection on
      // every collection change, and with duplicate events allowed (Kobalte's
      // Select default) even a no-op rewrite fires onChange and closes the
      // popover via closeOnSelection — breaking dynamic collections. Reselect
      // activation closes via SelectPopover's handlers instead.
      allowDuplicateSelectionEvents={false}
      placement={placement()}
      // Kobalte defaults sameWidth: true (pins the popover to the trigger's
      // exact width); upstream only enforces a min-width, so long labels
      // widen the popover instead of wrapping (see select.overrides.css).
      sameWidth={false}
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
        <SelectContext.Provider
          value={{
            get slots() {
              return slots()
            },
            setPlacement,
            mounted
          }}
        >
          <ListBoxCollectionContext.Provider value={setOptions}>
            {/* Header/Separator inside the popover's ListBox resolve to
                deferral markers (not DOM) so the closed popover's eager option
                registration stays hydration-safe (see AGENTS.md). */}
            <CollectionDeferContext.Provider value={true}>
              {/* Client-only: it renders an <option> per item, but items
                  register after Kobalte snapshots them on the server (SSR memos
                  never re-run), so hydrating it desyncs keys (see AGENTS.md). */}
              <Show when={mounted()}>
                <HiddenSelectPrimitive />
              </Show>
              {local.children}
            </CollectionDeferContext.Provider>
          </ListBoxCollectionContext.Provider>
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
          // Same mounted mirror as the default text path below — custom
          // children reading selection state mid-hydration hit the same
          // dropped-DOM-write / mismatch failure (see AGENTS.md).
          const mounted = context.mounted
          if (!mounted) {
            return body(state)
          }
          return body({
            selectedOption: () =>
              mounted() ? state.selectedOption() : undefined,
            selectedOptions: () => (mounted() ? state.selectedOptions() : []),
            remove: state.remove,
            clear: state.clear
          })
        }
        if (body != null) {
          return body
        }
        // Until mounted, mirror SSR's empty text (items are frozen out of the
        // server collection): item registration mid-hydration would settle
        // Kobalte's value memo on the final text while the DOM write is
        // dropped, leaving the trigger blank (see AGENTS.md).
        if (context.mounted && !context.mounted()) {
          return ""
        }
        return state
          .selectedOptions()
          .map((option) => option.textValue)
          .join(", ")
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

interface SelectIndicatorProps extends ComponentProps<"svg"> {
  class?: string
  children?: JSX.Element
}

const SelectIndicator = (props: SelectIndicatorProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
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
        {...(rest as unknown as ComponentProps<"span">)}
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
  const [local, rest] = splitProps(
    props as SelectPopoverProps & {
      ref?: HTMLElement | ((el: HTMLElement) => void)
      onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
      onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
    },
    ["class", "children", "placement", "ref", "onClick", "onKeyDown"]
  )
  const context = useContext(SelectContext)
  const selectContext = useSelectContext()
  const [contentEl, setContentEl] = createSignal<HTMLElement>()

  // Duplicate selection events are disabled on the root (see SelectRoot), so
  // Kobalte's closeOnSelection never sees a reselect of the current value —
  // close on option activation here instead (clicks and Enter; Space is left
  // to closeOnSelection since it can also be mid-typeahead). Runs after
  // Kobalte's own bubble-phase handlers, so selection is already applied and
  // a second close after a real selection change is a no-op.
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

  // Kobalte's Select omits onCurrentPlacementChange, so the popper-resolved
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
  // content mounts (Kobalte refuses to open a select with zero options).
  // The ListBox resolves to a render marker, not DOM; its render() only runs
  // below, inside the content, once the popover actually opens.
  const resolved = children(() => local.children)

  return (
    <SurfaceContext.Provider value={{ variant: "default" }}>
      <SelectPortalPrimitive>
        <SelectContentPrimitive
          ref={mergeRefs(setContentEl, local.ref)}
          class={cn(context.slots?.popover(), local.class)}
          data-slot="select-popover"
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
          <PreventScroll />
          <For each={resolved.toArray()}>
            {(child) => (isListBoxRenderMarker(child) ? child.render() : child)}
          </For>
        </SelectContentPrimitive>
      </SelectPortalPrimitive>
    </SurfaceContext.Provider>
  )
}

export type {
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
