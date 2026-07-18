import type { ComponentProps } from "solid-js"

import { DescriptionRoot } from "./description"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Description = Object.assign(DescriptionRoot, {
  Root: DescriptionRoot
})

export type Description = {
  Props: ComponentProps<typeof DescriptionRoot>
  RootProps: ComponentProps<typeof DescriptionRoot>
}

export type { DescriptionVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { descriptionVariants } from "@heroui/styles"
export type {
  DescriptionRootProps,
  DescriptionRootProps as DescriptionProps
} from "./description"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { DescriptionRoot }
