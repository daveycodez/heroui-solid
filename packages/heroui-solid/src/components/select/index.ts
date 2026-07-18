import type { ComponentProps } from "solid-js"

import {
  SelectIndicator,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectValue
} from "./select"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Indicator: SelectIndicator,
  Popover: SelectPopover
})

export type Select = {
  Props: ComponentProps<typeof SelectRoot>
  RootProps: ComponentProps<typeof SelectRoot>
  TriggerProps: ComponentProps<typeof SelectTrigger>
  ValueProps: ComponentProps<typeof SelectValue>
  IndicatorProps: ComponentProps<typeof SelectIndicator>
  PopoverProps: ComponentProps<typeof SelectPopover>
}

export type { SelectVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { selectVariants } from "@heroui/styles"
export type {
  SelectContextValue,
  SelectIndicatorProps,
  SelectPopoverProps,
  SelectRootProps,
  SelectRootProps as SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectValueState
} from "./select"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  SelectContext,
  SelectIndicator,
  SelectPopover,
  SelectRoot,
  SelectTrigger,
  SelectValue
} from "./select"
