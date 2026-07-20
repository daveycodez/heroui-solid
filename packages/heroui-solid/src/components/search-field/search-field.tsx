import {
  cn,
  type SearchFieldVariants,
  searchFieldVariants
} from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Input as InputPrimitive, TextField } from "@kobalte/core/text-field"
import { callHandler, mergeRefs } from "@kobalte/utils"
import {
  type ComponentProps,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"
import { CloseButton } from "../close-button"
import { IconSearch } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * SearchField Context
 * -----------------------------------------------------------------------------------------------*/
type SearchFieldContextValue = {
  slots?: ReturnType<typeof searchFieldVariants>
  value: () => string
  clear: () => void
  submit: () => boolean
  setInputRef: (el: HTMLInputElement) => void
}

const SearchFieldContext = createContext<SearchFieldContextValue>()

/* -------------------------------------------------------------------------------------------------
 * SearchField Root
 * -----------------------------------------------------------------------------------------------*/
type SearchFieldRootProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof TextField<T>
> &
  SearchFieldVariants & {
    onSubmit?: (value: string) => void
    onClear?: () => void
  }

const SearchFieldRoot = <T extends ValidComponent = "div">(
  props: SearchFieldRootProps<T>
) => {
  const p = props as SearchFieldRootProps
  const [variantProps, local, rest] = splitProps(
    p,
    searchFieldVariants.variantKeys,
    [
      "class",
      "children",
      "value",
      "defaultValue",
      "onChange",
      "onSubmit",
      "onClear"
    ]
  )
  const slots = createMemo(() => searchFieldVariants(variantProps))

  // Own the value so clear/Escape/submit can read and reset it, then drive
  // Kobalte's TextField in controlled mode. (Kobalte has no SearchField.)
  const [uncontrolled, setUncontrolled] = createSignal(local.defaultValue ?? "")
  const value = () => local.value ?? uncontrolled()
  const setValue = (next: string) => {
    if (local.value === undefined) {
      setUncontrolled(next)
    }
    local.onChange?.(next)
  }

  let inputRef: HTMLInputElement | undefined
  const clear = () => {
    setValue("")
    local.onClear?.()
    inputRef?.focus()
  }
  // Enter calls onSubmit when provided (and reports handled, so the input can
  // swallow the default form submit); otherwise it falls through to the form.
  const submit = () => {
    if (local.onSubmit) {
      local.onSubmit(value())
      return true
    }
    return false
  }

  return (
    <TextField
      class={cn(slots().base(), local.class)}
      data-slot="search-field"
      value={value()}
      onChange={setValue}
      // HeroUI CSS matches explicit data-*="true"; Kobalte stamps empty strings,
      // and props spread after its dataset so these re-stamps win.
      data-invalid={dataAttr(p.validationState === "invalid")}
      data-required={p.required}
      data-disabled={p.disabled}
      data-readonly={p.readOnly}
      data-empty={dataAttr(!value())}
      {...rest}
    >
      <SearchFieldContext.Provider
        value={{
          get slots() {
            return slots()
          },
          value,
          clear,
          submit,
          setInputRef: (el) => {
            inputRef = el
          }
        }}
      >
        {local.children}
      </SearchFieldContext.Provider>
    </TextField>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Group
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldGroupProps extends ComponentProps<"div"> {}

const SearchFieldGroup = (props: SearchFieldGroupProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const context = useContext(SearchFieldContext)
  const formControl = useContext(FormControlContext)

  return (
    <div
      class={cn(context?.slots?.group(), local.class)}
      data-slot="search-field-group"
      data-invalid={dataAttr(formControl?.validationState() === "invalid")}
      data-disabled={dataAttr(formControl?.isDisabled())}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Input
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldInputProps extends ComponentProps<typeof InputPrimitive> {}

const SearchFieldInput = (props: SearchFieldInputProps) => {
  const [local, rest] = splitProps(props, ["class", "onKeyDown", "ref"])
  const context = useContext(SearchFieldContext)

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    callHandler(
      event,
      local.onKeyDown as JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>
    )
    if (event.key === "Escape") {
      // Only clear a non-empty field; otherwise let Escape propagate (e.g. to
      // close a dialog) — matches React Aria's SearchField.
      if (context?.value()) {
        event.preventDefault()
        event.stopPropagation()
        context.clear()
      }
    } else if (event.key === "Enter") {
      if (context?.submit()) {
        event.preventDefault()
      }
    }
  }

  return (
    <InputPrimitive
      ref={mergeRefs(context?.setInputRef, local.ref)}
      type="search"
      class={cn(context?.slots?.input(), local.class)}
      data-slot="search-field-input"
      onKeyDown={onKeyDown}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Search Icon
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldSearchIconProps extends ComponentProps<"span"> {}

const SearchFieldSearchIcon = (props: SearchFieldSearchIconProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useContext(SearchFieldContext)

  return (
    <span
      class={cn(context?.slots?.searchIcon(), local.class)}
      data-slot="search-field-search-icon"
      aria-hidden="true"
      {...rest}
    >
      {local.children ?? <IconSearch />}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * SearchField Clear Button
 * -----------------------------------------------------------------------------------------------*/
interface SearchFieldClearButtonProps
  extends ComponentProps<typeof CloseButton> {}

const SearchFieldClearButton = (props: SearchFieldClearButtonProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const context = useContext(SearchFieldContext)

  return (
    <CloseButton
      class={cn(context?.slots?.clearButton(), local.class)}
      data-slot="search-field-clear-button"
      slot="clear"
      {...rest}
      onClick={() => context?.clear()}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type {
  SearchFieldClearButtonProps,
  SearchFieldGroupProps,
  SearchFieldInputProps,
  SearchFieldRootProps,
  SearchFieldSearchIconProps
}
export {
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
}
