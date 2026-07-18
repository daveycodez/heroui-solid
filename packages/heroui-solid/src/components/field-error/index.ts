import type { ComponentProps } from "solid-js"

import { FieldErrorRoot } from "./field-error"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const FieldError = Object.assign(FieldErrorRoot, {
  Root: FieldErrorRoot
})

export type FieldError = {
  Props: ComponentProps<typeof FieldErrorRoot>
  RootProps: ComponentProps<typeof FieldErrorRoot>
}

export type { FieldErrorVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { fieldErrorVariants } from "@heroui/styles"
export type {
  FieldErrorRootProps,
  FieldErrorRootProps as FieldErrorProps
} from "./field-error"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { FieldErrorRoot }
