import { ErrorMessageRoot, type ErrorMessageRootProps } from "./error-message"

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/
export const ErrorMessage = ErrorMessageRoot

export type ErrorMessage = {
  Props: ErrorMessageRootProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { errorMessageVariants } from "@heroui/styles"
