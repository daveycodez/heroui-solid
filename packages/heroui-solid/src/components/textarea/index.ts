import type { ComponentProps } from "solid-js"

import { TextAreaRoot } from "./textarea"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const TextArea = Object.assign(TextAreaRoot, {
  Root: TextAreaRoot
})

export type TextArea = {
  Props: ComponentProps<typeof TextAreaRoot>
  RootProps: ComponentProps<typeof TextAreaRoot>
}

export type { TextAreaVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { textAreaVariants } from "@heroui/styles"
export type {
  TextAreaRootProps,
  TextAreaRootProps as TextAreaProps
} from "./textarea"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { TextAreaRoot }
