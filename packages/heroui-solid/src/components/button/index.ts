import type { ComponentProps } from "solid-js"

import { ButtonRoot } from "./button"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Button = Object.assign(ButtonRoot, {
  Root: ButtonRoot
})

export type Button = {
  Props: ComponentProps<typeof ButtonRoot>
  RootProps: ComponentProps<typeof ButtonRoot>
}

export type { ButtonVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { buttonVariants } from "@heroui/styles"
export type { ButtonRootProps, ButtonRootProps as ButtonProps } from "./button"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ButtonRoot }
