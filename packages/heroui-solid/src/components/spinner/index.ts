import { SpinnerRoot, type SpinnerRootProps } from "./spinner"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Spinner = Object.assign(SpinnerRoot, {
  Root: SpinnerRoot
})

export type Spinner = {
  Props: SpinnerRootProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { SpinnerVariants } from "@heroui/styles"
export { spinnerVariants } from "@heroui/styles"
