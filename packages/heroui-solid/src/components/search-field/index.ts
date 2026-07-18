import type { ComponentProps } from "solid-js"

import {
  SearchFieldClearButton,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
} from "./search-field"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const SearchField = Object.assign(SearchFieldRoot, {
  Root: SearchFieldRoot,
  Group: SearchFieldGroup,
  Input: SearchFieldInput,
  SearchIcon: SearchFieldSearchIcon,
  ClearButton: SearchFieldClearButton
})

export type SearchField = {
  Props: ComponentProps<typeof SearchFieldRoot>
  RootProps: ComponentProps<typeof SearchFieldRoot>
  GroupProps: ComponentProps<typeof SearchFieldGroup>
  InputProps: ComponentProps<typeof SearchFieldInput>
  SearchIconProps: ComponentProps<typeof SearchFieldSearchIcon>
  ClearButtonProps: ComponentProps<typeof SearchFieldClearButton>
}

export type { SearchFieldVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { searchFieldVariants } from "@heroui/styles"
export type {
  SearchFieldClearButtonProps,
  SearchFieldContextValue,
  SearchFieldGroupProps,
  SearchFieldInputProps,
  SearchFieldRootProps,
  SearchFieldRootProps as SearchFieldProps,
  SearchFieldSearchIconProps
} from "./search-field"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  SearchFieldClearButton,
  SearchFieldContext,
  SearchFieldGroup,
  SearchFieldInput,
  SearchFieldRoot,
  SearchFieldSearchIcon
} from "./search-field"
