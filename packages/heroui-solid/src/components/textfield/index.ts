import type { TextFieldRootProps } from "./textfield"

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/
export { TextFieldContext, TextFieldRoot as TextField } from "./textfield"

export type TextField = {
  Props: TextFieldRootProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { TextFieldVariants } from "@heroui/styles"
export { textFieldVariants } from "@heroui/styles"
