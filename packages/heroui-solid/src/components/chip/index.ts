import {
  ChipLabel,
  type ChipLabelProps,
  ChipRoot,
  type ChipRootProps
} from "./chip"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Chip = Object.assign(ChipRoot, {
  Label: ChipLabel
})

export type Chip = {
  Props: ChipRootProps
  LabelProps: ChipLabelProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { ChipVariants } from "@heroui/styles"
export { chipVariants } from "@heroui/styles"
