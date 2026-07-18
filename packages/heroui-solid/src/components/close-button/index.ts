import type { ComponentProps } from "solid-js"

import { CloseButtonRoot } from "./close-button"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const CloseButton = Object.assign(CloseButtonRoot, {
  Root: CloseButtonRoot
})

export type CloseButton = {
  Props: ComponentProps<typeof CloseButtonRoot>
  RootProps: ComponentProps<typeof CloseButtonRoot>
}

export type { CloseButtonVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { closeButtonVariants } from "@heroui/styles"
export type {
  CloseButtonRootProps,
  CloseButtonRootProps as CloseButtonProps
} from "./close-button"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { CloseButtonRoot }
