import type { ComponentProps } from "solid-js"

import {
  MenuItemIndicator,
  MenuItemRoot,
  MenuItemSubmenuIndicator
} from "./menu-item"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const MenuItem = Object.assign(MenuItemRoot, {
  Root: MenuItemRoot,
  Indicator: MenuItemIndicator,
  SubmenuIndicator: MenuItemSubmenuIndicator
})

export type MenuItem = {
  Props: ComponentProps<typeof MenuItemRoot>
  RootProps: ComponentProps<typeof MenuItemRoot>
  IndicatorProps: ComponentProps<typeof MenuItemIndicator>
  SubmenuIndicatorProps: ComponentProps<typeof MenuItemSubmenuIndicator>
}

export type { MenuItemVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { menuItemVariants } from "@heroui/styles"
export type {
  MenuContextValue,
  MenuItemContextValue,
  MenuItemIndicatorProps,
  MenuItemIndicatorState,
  MenuItemRootProps,
  MenuItemRootProps as MenuItemProps,
  MenuItemSubmenuIndicatorProps,
  Selection,
  SelectionContextValue,
  SelectionMode,
  SelectionProps
} from "./menu-item"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  createSelectionContextValue,
  MenuContext,
  MenuItemContext,
  MenuItemIndicator,
  MenuItemRoot,
  MenuItemSubmenuIndicator,
  SelectionContext,
  SubmenuTriggerContext
} from "./menu-item"
