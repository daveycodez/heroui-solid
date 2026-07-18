import type { ComponentProps } from "solid-js"

import { SeparatorRoot } from "./separator"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Separator = Object.assign(SeparatorRoot, {
  Root: SeparatorRoot
})

export type Separator = {
  Props: ComponentProps<typeof SeparatorRoot>
  RootProps: ComponentProps<typeof SeparatorRoot>
}

export type { SeparatorVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { separatorVariants } from "@heroui/styles"
export type {
  SeparatorRootProps,
  SeparatorRootProps as SeparatorProps
} from "./separator"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { SeparatorRoot } from "./separator"
