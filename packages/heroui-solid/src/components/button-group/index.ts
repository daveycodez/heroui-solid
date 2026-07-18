import type { ComponentProps } from "solid-js"

import { ButtonGroupRoot, ButtonGroupSeparator } from "./button-group"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator
})

export type ButtonGroup = {
  Props: ComponentProps<typeof ButtonGroupRoot>
  RootProps: ComponentProps<typeof ButtonGroupRoot>
  SeparatorProps: ComponentProps<typeof ButtonGroupSeparator>
}

export type { ButtonGroupVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { buttonGroupVariants } from "@heroui/styles"
export type {
  ButtonGroupRootProps,
  ButtonGroupRootProps as ButtonGroupProps,
  ButtonGroupSeparatorProps
} from "./button-group"
/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
export { ButtonGroupContext } from "./button-group"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ButtonGroupRoot, ButtonGroupSeparator }
