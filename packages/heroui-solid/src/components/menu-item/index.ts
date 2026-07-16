import type { ComponentProps } from "solid-js"

import { MenuItemRoot } from "./menu-item"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const MenuItem = Object.assign(MenuItemRoot, {
  Root: MenuItemRoot
})

export type MenuItem = {
  Props: ComponentProps<typeof MenuItemRoot>
  RootProps: ComponentProps<typeof MenuItemRoot>
}

export type { MenuItemVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { menuItemVariants } from "@heroui/styles"
export type { MenuContextValue, MenuItemRootProps } from "./menu-item"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { MenuContext, MenuItemRoot } from "./menu-item"
