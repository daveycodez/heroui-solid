import { cn, type InputVariants, inputVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Input as InputPrimitive } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  mergeProps,
  splitProps,
  useContext
} from "solid-js"

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

  // Use variant from context if not explicitly provided
  const resolvedVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? textFieldContext.variant
    }
  })

  return formControl ? (
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

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { InputRootProps }
export { InputRoot }
