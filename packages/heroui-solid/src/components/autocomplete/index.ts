import type { ComponentProps } from "solid-js"

import {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue
} from "./autocomplete"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Autocomplete = Object.assign(AutocompleteRoot, {
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  ClearButton: AutocompleteClearButton,
  Indicator: AutocompleteIndicator,
  Popover: AutocompletePopover,
  Filter: AutocompleteFilter
})

export type Autocomplete = {
  Props: ComponentProps<typeof AutocompleteRoot>
  RootProps: ComponentProps<typeof AutocompleteRoot>
  TriggerProps: ComponentProps<typeof AutocompleteTrigger>
  ValueProps: ComponentProps<typeof AutocompleteValue>
  ClearButtonProps: ComponentProps<typeof AutocompleteClearButton>
  IndicatorProps: ComponentProps<typeof AutocompleteIndicator>
  PopoverProps: ComponentProps<typeof AutocompletePopover>
  FilterProps: ComponentProps<typeof AutocompleteFilter>
}

export type { AutocompleteVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { autocompleteVariants } from "@heroui/styles"
export type {
  AutocompleteClearButtonProps,
  AutocompleteContextValue,
  AutocompleteFilterProps,
  AutocompleteIndicatorProps,
  AutocompletePopoverProps,
  AutocompleteRootProps,
  AutocompleteRootProps as AutocompleteProps,
  AutocompleteTriggerProps,
  AutocompleteValueProps,
  AutocompleteValueRenderProps,
  AutocompleteValueState
} from "./autocomplete"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  AutocompleteClearButton,
  AutocompleteContext,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue
} from "./autocomplete"
