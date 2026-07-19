import type { ComponentProps } from "solid-js"

import {
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger
} from "./combo-box"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ComboBox = Object.assign(ComboBoxRoot, {
  Root: ComboBoxRoot,
  InputGroup: ComboBoxInputGroup,
  Trigger: ComboBoxTrigger,
  Popover: ComboBoxPopover
})

export type ComboBox = {
  Props: ComponentProps<typeof ComboBoxRoot>
  RootProps: ComponentProps<typeof ComboBoxRoot>
  InputGroupProps: ComponentProps<typeof ComboBoxInputGroup>
  TriggerProps: ComponentProps<typeof ComboBoxTrigger>
  PopoverProps: ComponentProps<typeof ComboBoxPopover>
}

export type { ComboBoxVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { comboBoxVariants } from "@heroui/styles"
export type {
  ComboBoxContextValue,
  ComboBoxInputGroupProps,
  ComboBoxPopoverProps,
  ComboBoxRootProps,
  ComboBoxRootProps as ComboBoxProps,
  ComboBoxTriggerProps
} from "./combo-box"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  ComboBoxContext,
  ComboBoxInputContext,
  ComboBoxInputGroup,
  ComboBoxPopover,
  ComboBoxRoot,
  ComboBoxTrigger
} from "./combo-box"
