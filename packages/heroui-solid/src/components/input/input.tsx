import { cn, type InputVariants, inputVariants } from "@heroui/styles"
import { Input as InputPrimitive } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  mergeProps,
  splitProps,
  useContext
} from "solid-js"

import { FieldContext } from "../../utils/field-context"
import { TextFieldContext } from "../textfield/textfield"

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
  const field = useContext(FieldContext)
  const textFieldContext = useContext(TextFieldContext)

  // Use variant from context if not explicitly provided
  const resolvedVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? textFieldContext.variant
    }
  })

  return field ? (
    <InputPrimitive
      class={cn(inputVariants(resolvedVariants), local.class)}
      data-slot="input"
      {...(rest as InputPrimitiveProps)}
    />
  ) : (
    <input
      class={cn(inputVariants(resolvedVariants), local.class)}
      data-slot="input"
      {...rest}
    />
  )
}

export type { InputRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { InputRoot }
