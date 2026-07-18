import type { ComponentProps } from "solid-js"

import { ChipLabel, ChipRoot } from "./chip"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel
})

export type Chip = {
  Props: ComponentProps<typeof ChipRoot>
  RootProps: ComponentProps<typeof ChipRoot>
  LabelProps: ComponentProps<typeof ChipLabel>
}

export type { ChipVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { chipVariants } from "@heroui/styles"
export type {
  ChipLabelProps,
  ChipRootProps,
  ChipRootProps as ChipProps
} from "./chip"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ChipLabel, ChipRoot }
