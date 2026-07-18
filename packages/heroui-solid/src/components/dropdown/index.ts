import type { ComponentProps } from "solid-js"

import {
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger
} from "./dropdown"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Dropdown = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Popover: DropdownPopover,
  Menu: DropdownMenu,
  Item: DropdownItem,
  ItemIndicator: DropdownItemIndicator,
  Section: DropdownSection,
  SubmenuTrigger: DropdownSubmenuTrigger,
  SubmenuIndicator: DropdownSubmenuIndicator
})

export type Dropdown = {
  Props: ComponentProps<typeof DropdownRoot>
  RootProps: ComponentProps<typeof DropdownRoot>
  TriggerProps: ComponentProps<typeof DropdownTrigger>
  PopoverProps: ComponentProps<typeof DropdownPopover>
  MenuProps: ComponentProps<typeof DropdownMenu>
  ItemProps: ComponentProps<typeof DropdownItem>
  ItemIndicatorProps: ComponentProps<typeof DropdownItemIndicator>
  SectionProps: ComponentProps<typeof DropdownSection>
  SubmenuTriggerProps: ComponentProps<typeof DropdownSubmenuTrigger>
  SubmenuIndicatorProps: ComponentProps<typeof DropdownSubmenuIndicator>
}

export type { DropdownVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { dropdownVariants } from "@heroui/styles"
export type {
  DropdownContextValue,
  DropdownItemIndicatorProps,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopoverProps,
  DropdownRootProps,
  DropdownRootProps as DropdownProps,
  DropdownSectionProps,
  DropdownSubmenuIndicatorProps,
  DropdownSubmenuTriggerProps,
  DropdownTriggerProps
} from "./dropdown"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  DropdownContext,
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger
} from "./dropdown"
