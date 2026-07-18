import type { ComponentProps } from "solid-js"

import { HeaderRoot } from "./header"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Header = HeaderRoot

export type Header = {
  Props: ComponentProps<typeof HeaderRoot>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { headerVariants } from "@heroui/styles"
export type { HeaderRootProps, HeaderRootProps as HeaderProps } from "./header"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { HeaderRoot } from "./header"
