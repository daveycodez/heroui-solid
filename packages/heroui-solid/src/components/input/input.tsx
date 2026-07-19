import { cn, type InputVariants, inputVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Input as ComboboxInputPrimitive } from "@kobalte/core/combobox"
import { Input as InputPrimitive } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  mergeProps,
  splitProps,
  useContext
} from "solid-js"

import { ComboBoxInputContext } from "../combo-box/combo-box"
import { TextFieldContext } from "../textfield/textfield"

type InputPrimitiveProps = ComponentProps<typeof InputPrimitive>
type ComboboxInputPrimitiveProps = ComponentProps<typeof ComboboxInputPrimitive>

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
  const inComboBox = useContext(ComboBoxInputContext)

  // Use variant from context if not explicitly provided
  const resolvedVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? textFieldContext.variant
    }
  })

  // Inside a ComboBox.InputGroup, render as Kobalte's ComboboxInput so it wires
  // the filter text + combobox a11y; standalone behavior is unchanged.
  if (inComboBox) {
    return (
      <ComboboxInputPrimitive
        class={cn(inputVariants(resolvedVariants), local.class)}
        data-slot="input"
        {...(rest as ComboboxInputPrimitiveProps)}
      />
    )
  }

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
