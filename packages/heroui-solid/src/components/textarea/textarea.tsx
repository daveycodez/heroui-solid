import { cn, type TextAreaVariants, textAreaVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { TextArea as TextAreaPrimitive } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  mergeProps,
  splitProps,
  useContext
} from "solid-js"

import { TextFieldContext } from "../textfield/textfield"

type TextAreaPrimitiveProps = ComponentProps<typeof TextAreaPrimitive>

/* -------------------------------------------------------------------------------------------------
 * TextArea Root
 * -----------------------------------------------------------------------------------------------*/
interface TextAreaRootProps
  extends ComponentProps<"textarea">,
    TextAreaVariants {
  autoResize?: boolean
  submitOnEnter?: boolean
}

const TextAreaRoot = (props: TextAreaRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    textAreaVariants.variantKeys,
    ["class", "autoResize", "submitOnEnter"]
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
    <TextAreaPrimitive
      class={cn(textAreaVariants(resolvedVariants), local.class)}
      data-slot="textarea"
      autoResize={local.autoResize}
      submitOnEnter={local.submitOnEnter}
      {...(rest as TextAreaPrimitiveProps)}
    />
  ) : (
    <textarea
      class={cn(textAreaVariants(resolvedVariants), local.class)}
      data-slot="textarea"
      {...rest}
    />
  )
}

export type { TextAreaRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { TextAreaRoot }
