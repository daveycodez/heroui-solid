import { cn, type InputGroupVariants, inputGroupVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import {
  type ComponentProps,
  createContext,
  createMemo,
  type JSX,
  mergeProps,
  splitProps,
  useContext
} from "solid-js"
import { dataAttr } from "../../utils/assertion"
import { TextFieldContext } from "../textfield"

/* -------------------------------------------------------------------------------------------------
 * InputGroup Context
 * -----------------------------------------------------------------------------------------------*/
type InputGroupContextValue = {
  slots?: ReturnType<typeof inputGroupVariants>
}

// Consumed by Input/TextArea (see input.tsx, textarea.tsx): when present they
// swap their standalone `.input`/`.textarea` base for the group's input slot, so
// InputGroup.Input/TextArea reuse those components verbatim (autoResize included).
const InputGroupContext = createContext<InputGroupContextValue>({})

// Descendants that own their own click and must not trigger the group's
// focus-the-field affordance (the field elements are included so clicking them
// falls through to native focus). See handleClick below.
const INTERACTIVE_CHILD_SELECTOR =
  'button, a, input, textarea, select, [role="button"]'

/* -------------------------------------------------------------------------------------------------
 * InputGroup Root
 * -----------------------------------------------------------------------------------------------*/
interface InputGroupRootProps
  extends ComponentProps<"div">,
    InputGroupVariants {}

const InputGroupRoot = (props: InputGroupRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    inputGroupVariants.variantKeys,
    ["class", "onClick"]
  )
  const textFieldContext = useContext(TextFieldContext)
  const formControl = useContext(FormControlContext)

  // Variant falls back to the parent TextField's, like Input/TextArea.
  const resolvedVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? textFieldContext.variant
    }
  })
  const slots = createMemo(() => inputGroupVariants(resolvedVariants))

  let groupRef: HTMLDivElement | undefined

  // HeroUI add-on: clicking the group's "dead space" (text, icons, padding)
  // focuses the field. Skip interactive controls so a suffix button/link keeps
  // its own focus: upstream's React Aria Button swallows its click via usePress
  // (stopPropagation), so their group handler never runs for a suffix press;
  // Kobalte's Button doesn't, so — like shadcn's InputGroupAddon — we gate on the
  // click target instead. The field elements are in the list too, so clicking the
  // input/textarea leaves native focus alone.
  const handleClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    const target = event.target as HTMLElement

    if (!target.closest(INTERACTIVE_CHILD_SELECTOR)) {
      groupRef?.querySelector<HTMLElement>("input, textarea")?.focus()
    }

    if (typeof local.onClick === "function") {
      local.onClick(event)
    }
  }

  return (
    <InputGroupContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: click-to-focus is a pointer-only affordance duplicating native focus; keyboard users tab straight to the input. Mirrors React Aria's Group. */}
      {/* biome-ignore lint/a11y/useSemanticElements: role="group" mirrors React Aria's Group — an input-field wrapper, not a semantic <fieldset>. */}
      <div
        ref={groupRef}
        role="group"
        class={cn(slots().base(), local.class)}
        data-slot="input-group"
        // HeroUI CSS matches explicit data-*="true"; mirror the parent field's
        // state onto the group so its invalid/disabled styling lights up.
        data-invalid={dataAttr(formControl?.validationState() === "invalid")}
        data-disabled={dataAttr(formControl?.isDisabled())}
        onClick={handleClick}
        {...rest}
      />
    </InputGroupContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * InputGroup Prefix
 * -----------------------------------------------------------------------------------------------*/
interface InputGroupPrefixProps extends ComponentProps<"div"> {}

const InputGroupPrefix = (props: InputGroupPrefixProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const { slots } = useContext(InputGroupContext)

  return (
    <div
      class={cn(slots?.prefix(), local.class)}
      data-slot="input-group-prefix"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * InputGroup Suffix
 * -----------------------------------------------------------------------------------------------*/
interface InputGroupSuffixProps extends ComponentProps<"div"> {}

const InputGroupSuffix = (props: InputGroupSuffixProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const { slots } = useContext(InputGroupContext)

  return (
    <div
      class={cn(slots?.suffix(), local.class)}
      data-slot="input-group-suffix"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type {
  InputGroupContextValue,
  InputGroupPrefixProps,
  InputGroupRootProps,
  InputGroupSuffixProps
}
export { InputGroupContext, InputGroupPrefix, InputGroupRoot, InputGroupSuffix }
