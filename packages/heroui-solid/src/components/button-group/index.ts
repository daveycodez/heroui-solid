import {
  ButtonGroupRoot,
  type ButtonGroupRootProps,
  ButtonGroupSeparator,
  type ButtonGroupSeparatorProps
} from "./button-group"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Separator: ButtonGroupSeparator
})

export type ButtonGroup = {
  Props: ButtonGroupRootProps
  SeparatorProps: ButtonGroupSeparatorProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { ButtonGroupVariants } from "@heroui/styles"
export { buttonGroupVariants } from "@heroui/styles"
