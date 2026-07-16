import type { ComponentProps } from "solid-js"

import { TextFieldRoot } from "./textfield"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const TextField = Object.assign(TextFieldRoot, {
  Root: TextFieldRoot
})

export type TextField = {
  Props: ComponentProps<typeof TextFieldRoot>
  RootProps: ComponentProps<typeof TextFieldRoot>
}

export type { TextFieldVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { textFieldVariants } from "@heroui/styles"
export type {
  TextFieldContextValue,
  TextFieldRootProps,
  TextFieldRootProps as TextFieldProps
} from "./textfield"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { TextFieldContext, TextFieldRoot } from "./textfield"
