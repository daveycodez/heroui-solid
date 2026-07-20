import {
  SearchFieldClearButton,
  type SearchFieldClearButtonProps,
  SearchFieldGroup,
  type SearchFieldGroupProps,
  SearchFieldInput,
  type SearchFieldInputProps,
  SearchFieldRoot,
  type SearchFieldRootProps,
  SearchFieldSearchIcon,
  type SearchFieldSearchIconProps
} from "./search-field"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const SearchField = Object.assign(SearchFieldRoot, {
  Group: SearchFieldGroup,
  Input: SearchFieldInput,
  SearchIcon: SearchFieldSearchIcon,
  ClearButton: SearchFieldClearButton
})

export type SearchField = {
  Props: SearchFieldRootProps
  GroupProps: SearchFieldGroupProps
  InputProps: SearchFieldInputProps
  SearchIconProps: SearchFieldSearchIconProps
  ClearButtonProps: SearchFieldClearButtonProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { SearchFieldVariants } from "@heroui/styles"
export { searchFieldVariants } from "@heroui/styles"
