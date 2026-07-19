import {
  cn,
  type SearchFieldVariants,
  searchFieldVariants
} from "@heroui/styles"
import {
  Input as TextFieldInputPrimitive,
  Root as TextFieldPrimitive
} from "@kobalte/core/text-field"
import { callHandler, mergeRefs } from "@kobalte/utils"
import {
  type ComponentProps,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  onMount,
  splitProps,
  useContext
} from "solid-js"

import { useCollectionDefer } from "../../utils/collection-defer"
import { CloseButtonRoot } from "../close-button/close-button"

/* -------------------------------------------------------------------------------------------------
 * Search Icon
 * -----------------------------------------------------------------------------------------------*/
// Upstream stamps aria-label on this aria-hidden svg (an a11y defect); dropped
// here, keeping aria-hidden + role="presentation" (see AGENTS.md, CloseIcon).
const IconSearch = (props: ComponentProps<"svg">) => (
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
      d="M11.5 7a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-.82 4.74a6 6 0 1 1 1.06-1.06l2.79 2.79a.75.75 0 1 1-1.06 1.06z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

/* -------------------------------------------------------------------------------------------------
 * SearchField Context
 * -----------------------------------------------------------------------------------------------*/
type SearchFieldContextValue = {
  slots: () => ReturnType<typeof searchFieldVariants>
  isInvalid: () => boolean
  isDisabled: () => boolean
  isEmpty: () => boolean
  clear: () => void
  submit: () => void
  registerInput: (el: HTMLInputElement) => void
}

const SearchFieldContext = createContext<SearchFieldContextValue>()

const useSearchField = (): SearchFieldContextValue => {
  const ctx = useContext(SearchFieldContext)
  if (!ctx) {
    throw new Error("SearchField parts must be used within <SearchField>")
  }
  return ctx
}

// Optional external control: a parent (e.g. Autocomplete.Filter) drives the
// field's value/onChange without the consumer wiring `value` explicitly. When
// present and the field has no `value` prop, the field binds here; absent, the
// field behaves standalone (uncontrolled/controlled as before). The optional
// members let the parent turn the input into an aria-activedescendant combobox
// over an adjacent listbox (Autocomplete's virtual-focus keyboard nav): it
// registers the input element, intercepts navigation keys, and supplies the
// combobox ARIA attributes.
type SearchFieldControlContextValue = {
  value: () => string
  onChange: (value: string) => void
  registerInput?: (el: HTMLInputElement) => void
  onInputKeyDown?: (event: KeyboardEvent) => void
  inputAria?: () => Record<string, string | boolean | undefined>
}

const SearchFieldControlContext =
  createContext<SearchFieldControlContextValue>()

/* -------------------------------------------------------------------------------------------------
 * SearchField Root
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldRootProps extends SearchFieldVariants {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onClear?: () => void
  onSubmit?: (value: string) => void
  name?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  autoFocus?: boolean
  class?: string
  children?: JSX.Element
}

const SearchFieldRoot = (props: SearchFieldRootProps) => {
  // Inside a collection-deferring picker (the Autocomplete popover) hold the
  // field as a deferred render so its <input> DOM isn't created while the
  // closed popover eagerly registers its collection (SSR/hydration-safe — see
  // AGENTS.md). The marker's render() mounts a fresh field, so onMount/autofocus
  // still fire when the popover opens. Standalone (no provider) it renders now.
  const deferred = useCollectionDefer(() => <SearchFieldRootInner {...props} />)
  if (deferred) {
    return deferred as unknown as JSX.Element
  }
  return <SearchFieldRootInner {...props} />
}

const SearchFieldRootInner = (props: SearchFieldRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    searchFieldVariants.variantKeys,
    [
      "value",
      "defaultValue",
      "onChange",
      "onClear",
      "onSubmit",
      "isDisabled",
      "isReadOnly",
      "isRequired",
      "isInvalid",
      "autoFocus",
      "class",
      "children"
    ]
  )
  const slots = createMemo(() => searchFieldVariants(variantProps))

  // Optional parent control (Autocomplete.Filter) — used only when the field
  // has no explicit `value` prop, so standalone behavior is unchanged.
  const control = useContext(SearchFieldControlContext)
  const [uncontrolled, setUncontrolled] = createSignal(local.defaultValue ?? "")
  const value = () => {
    if (local.value !== undefined) return local.value
    if (control) return control.value()
    return uncontrolled()
  }
  const setValue = (next: string) => {
    if (local.value === undefined) {
      if (control) control.onChange(next)
      else setUncontrolled(next)
    }
    local.onChange?.(next)
  }

  let inputEl: HTMLInputElement | undefined
  const clear = () => {
    setValue("")
    local.onClear?.()
    // preventScroll: inside the Autocomplete popover the input is portaled, so a
    // bare focus() scrolls the page to it (Kobalte focuses without scrolling).
    inputEl?.focus({ preventScroll: true })
  }

  // Kobalte's TextField root is a <div>, so autoFocus must land on the input.
  // preventScroll so autofocusing the in-popover field on open doesn't scroll
  // the page to it (see clear()).
  onMount(() => {
    if (local.autoFocus) inputEl?.focus({ preventScroll: true })
  })

  const context: SearchFieldContextValue = {
    slots,
    isInvalid: () => !!local.isInvalid,
    isDisabled: () => !!local.isDisabled,
    isEmpty: () => value() === "",
    clear,
    submit: () => local.onSubmit?.(value()),
    registerInput: (el) => {
      inputEl = el
    }
  }

  return (
    <TextFieldPrimitive
      class={cn(slots().base(), local.class)}
      data-slot="search-field"
      value={value()}
      onChange={setValue}
      validationState={local.isInvalid ? "invalid" : undefined}
      disabled={local.isDisabled}
      readOnly={local.isReadOnly}
      required={local.isRequired}
      // HeroUI CSS matches explicit data-*="true" values; Kobalte stamps empty
      // strings, so re-stamp here (rest spreads after Kobalte's dataset).
      data-invalid={local.isInvalid ? "true" : undefined}
      data-required={local.isRequired ? "true" : undefined}
      data-disabled={local.isDisabled ? "true" : undefined}
      data-readonly={local.isReadOnly ? "true" : undefined}
      data-empty={value() === "" ? "true" : undefined}
      {...rest}
    >
      <SearchFieldContext.Provider value={context}>
        {local.children}
      </SearchFieldContext.Provider>
    </TextFieldPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Group
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldGroupProps extends ComponentProps<"div"> {}

const SearchFieldGroup = (props: SearchFieldGroupProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const ctx = useSearchField()

  return (
    <div
      class={cn(ctx.slots().group(), local.class)}
      data-slot="search-field-group"
      // React Aria's Group stamps these; Kobalte does not (the div is not a
      // form-control root), so bridge them from the field state.
      data-invalid={ctx.isInvalid() ? "true" : undefined}
      data-disabled={ctx.isDisabled() ? "true" : undefined}
      {...rest}
    >
      {local.children}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Input
 * -----------------------------------------------------------------------------------------------*/
type TextFieldInputProps = ComponentProps<typeof TextFieldInputPrimitive>
interface SearchFieldInputProps extends TextFieldInputProps {}

const SearchFieldInput = (props: SearchFieldInputProps) => {
  const [local, rest] = splitProps(props, ["class", "ref", "onKeyDown"])
  const ctx = useSearchField()
  // Present only when a parent (Autocomplete) drives virtual-focus keyboard nav.
  const control = useContext(SearchFieldControlContext)

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    callHandler(event, local.onKeyDown)
    // Honor a consumer that consumed the key in their own onKeyDown.
    if (event.defaultPrevented) {
      return
    }
    // Virtual-focus nav (ArrowUp/Down/Home/End/Enter/Escape) runs next and
    // preventDefaults the keys it owns, so the field's own Escape/Enter
    // behavior only fires for keys the parent left alone.
    control?.onInputKeyDown?.(event)
    if (event.defaultPrevented) {
      return
    }
    if (event.key === "Escape") {
      event.preventDefault()
      ctx.clear()
    } else if (event.key === "Enter") {
      ctx.submit()
    }
  }

  return (
    <TextFieldInputPrimitive
      type="search"
      class={cn(ctx.slots().input(), local.class)}
      data-slot="search-field-input"
      ref={mergeRefs(ctx.registerInput, control?.registerInput, local.ref)}
      onKeyDown={handleKeyDown}
      {...(rest as TextFieldInputProps)}
      {...(control?.inputAria?.() ?? {})}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Search Icon
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldSearchIconProps extends ComponentProps<"svg"> {
  children?: JSX.Element
}

const SearchFieldSearchIcon = (props: SearchFieldSearchIconProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const ctx = useSearchField()

  // Single read of children (a wrapper keeps a custom icon in place of the
  // default IconSearch, mirroring upstream's cloneElement of the slot class).
  return (() => {
    const child = local.children
    const className = cn(ctx.slots().searchIcon(), local.class)
    return child != null ? (
      <span class={className} data-slot="search-field-search-icon">
        {child}
      </span>
    ) : (
      <IconSearch
        class={className}
        data-slot="search-field-search-icon"
        {...rest}
      />
    )
  })()
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Clear Button
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldClearButtonProps
  extends ComponentProps<typeof CloseButtonRoot> {}

const SearchFieldClearButton = (props: SearchFieldClearButtonProps) => {
  const [local, rest] = splitProps(props as SearchFieldClearButtonProps, [
    "class",
    "onClick"
  ])
  const ctx = useSearchField()

  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    if (ctx.isDisabled()) return
    callHandler(event, local.onClick)
    ctx.clear()
  }

  return (
    <CloseButtonRoot
      aria-label="Clear search"
      class={cn(ctx.slots().clearButton(), local.class)}
      data-slot="search-field-clear-button"
      slot="clear"
      // React Aria disables the clear button with the field; mirror that so it
      // can't wipe the value + refocus a disabled input.
      disabled={ctx.isDisabled()}
      // When empty the button is hidden (opacity-0 pointer-events-none), which
      // still leaves it in the tab order — a keyboard user lands on an invisible
      // control. Drop it from the tab order until there's a value to clear.
      tabindex={ctx.isEmpty() ? -1 : undefined}
      onClick={handleClick}
      {...rest}
    />
  )
}

export type {
  SearchFieldClearButtonProps,
  SearchFieldContextValue,
  SearchFieldControlContextValue,
  SearchFieldGroupProps,
  SearchFieldInputProps,
  SearchFieldRootProps,
  SearchFieldSearchIconProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  SearchFieldClearButton,
  SearchFieldContext,
  SearchFieldControlContext,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
}
