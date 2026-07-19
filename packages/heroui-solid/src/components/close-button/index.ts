import { CloseButtonRoot, type CloseButtonRootProps } from "./close-button"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const CloseButton = Object.assign(CloseButtonRoot, {
  Root: CloseButtonRoot
})

export type CloseButton = {
  Props: CloseButtonRootProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { CloseButtonVariants } from "@heroui/styles"
export { closeButtonVariants } from "@heroui/styles"
