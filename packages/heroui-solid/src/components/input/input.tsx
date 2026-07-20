import { cn, type InputVariants, inputVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Input as InputPrimitive } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  mergeProps,
  splitProps,
  useContext
} from "solid-js"

import { InputGroupContext } from "../input-group/input-group"
import { TextFieldContext } from "../textfield"

type InputPrimitiveProps = ComponentProps<typeof InputPrimitive>

/* -------------------------------------------------------------------------------------------------
 * Input Root
 * -----------------------------------------------------------------------------------------------*/
interface InputRootProps extends ComponentProps<"input">, InputVariants {}

const InputRoot = (props: InputRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    inputVariants.variantKeys,
    ["class"]
  )
  const formControl = useContext(FormControlContext)
  const textFieldContext = useContext(TextFieldContext)
  const inputGroup = useContext(InputGroupContext)

  // Use variant from context if not explicitly provided
  const resolvedVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? textFieldContext.variant
    }
  })

  // Inside an InputGroup, adopt the group's input slot + data-slot instead of the
  // standalone `.input` base — the group shell owns the border/background.
  const className = () =>
    inputGroup.slots
      ? cn(inputGroup.slots.input(), local.class)
      : cn(inputVariants(resolvedVariants), local.class)
  const slot = () => (inputGroup.slots ? "input-group-input" : "input")

  return formControl ? (
    <InputPrimitive
      class={className()}
      data-slot={slot()}
      {...(rest as InputPrimitiveProps)}
    />
  ) : (
    <input class={className()} data-slot={slot()} {...rest} />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { InputRootProps }
export { InputRoot }
