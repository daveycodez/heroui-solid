import type { ComponentProps } from "solid-js"

import { ErrorMessageRoot } from "./error-message"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ErrorMessage = Object.assign(ErrorMessageRoot, {
  Root: ErrorMessageRoot
})

export type ErrorMessage = {
  Props: ComponentProps<typeof ErrorMessageRoot>
  RootProps: ComponentProps<typeof ErrorMessageRoot>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { errorMessageVariants } from "@heroui/styles"
export type {
  ErrorMessageRootProps,
  ErrorMessageRootProps as ErrorMessageProps
} from "./error-message"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ErrorMessageRoot } from "./error-message"
