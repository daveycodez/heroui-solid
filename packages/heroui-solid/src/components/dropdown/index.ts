import type { ComponentProps } from "solid-js"

import {
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
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
  Section: DropdownSection
})

export type Dropdown = {
  Props: ComponentProps<typeof DropdownRoot>
  RootProps: ComponentProps<typeof DropdownRoot>
  TriggerProps: ComponentProps<typeof DropdownTrigger>
  PopoverProps: ComponentProps<typeof DropdownPopover>
  MenuProps: ComponentProps<typeof DropdownMenu>
  ItemProps: ComponentProps<typeof DropdownItem>
  SectionProps: ComponentProps<typeof DropdownSection>
}

export type { DropdownVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { dropdownVariants } from "@heroui/styles"
export type {
  DropdownContextValue,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopoverProps,
  DropdownRootProps,
  DropdownRootProps as DropdownProps,
  DropdownTriggerProps
} from "./dropdown"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  DropdownContext,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownTrigger
} from "./dropdown"
