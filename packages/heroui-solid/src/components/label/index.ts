import type { ComponentProps } from "solid-js"

import { LabelRoot } from "./label"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Label = Object.assign(LabelRoot, {
  Root: LabelRoot
})

export type Label = {
  Props: ComponentProps<typeof LabelRoot>
  RootProps: ComponentProps<typeof LabelRoot>
}

export type { LabelVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { labelVariants } from "@heroui/styles"
export type { LabelRootProps, LabelRootProps as LabelProps } from "./label"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { LabelRoot }
