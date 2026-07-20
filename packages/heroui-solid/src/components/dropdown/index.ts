import {
  DropdownArrow,
  DropdownCheckboxItem,
  type DropdownCheckboxItemProps,
  DropdownContent,
  type DropdownContentProps,
  DropdownGroup,
  DropdownGroupLabel,
  type DropdownGroupLabelProps,
  type DropdownGroupProps,
  DropdownIcon,
  DropdownItem,
  DropdownItemIndicator,
  type DropdownItemIndicatorProps,
  type DropdownItemProps,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  type DropdownRadioItemProps,
  DropdownRoot,
  type DropdownRootProps,
  DropdownSub,
  DropdownSubContent,
  type DropdownSubContentProps,
  DropdownSubTrigger,
  type DropdownSubTriggerProps,
  DropdownTrigger,
  type DropdownTriggerProps
} from "./dropdown"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Portal: DropdownPortal,
  Content: DropdownContent,
  Arrow: DropdownArrow,
  Item: DropdownItem,
  ItemIndicator: DropdownItemIndicator,
  Group: DropdownGroup,
  GroupLabel: DropdownGroupLabel,
  Icon: DropdownIcon,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent
})

export type Dropdown = {
  Props: DropdownRootProps
  TriggerProps: DropdownTriggerProps
  ContentProps: DropdownContentProps
  ItemProps: DropdownItemProps
  ItemIndicatorProps: DropdownItemIndicatorProps
  GroupProps: DropdownGroupProps
  GroupLabelProps: DropdownGroupLabelProps
  CheckboxItemProps: DropdownCheckboxItemProps
  RadioItemProps: DropdownRadioItemProps
  SubTriggerProps: DropdownSubTriggerProps
  SubContentProps: DropdownSubContentProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { dropdownVariants } from "@heroui/styles"
