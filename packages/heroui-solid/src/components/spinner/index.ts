import type { ComponentProps } from "solid-js"

import { SpinnerRoot } from "./spinner"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Spinner = Object.assign(SpinnerRoot, {
  Root: SpinnerRoot
})

export type Spinner = {
  Props: ComponentProps<typeof SpinnerRoot>
  RootProps: ComponentProps<typeof SpinnerRoot>
}

export type { SpinnerVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { spinnerVariants } from "@heroui/styles"
export type {
  SpinnerRootProps,
  SpinnerRootProps as SpinnerProps
} from "./spinner"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { SpinnerRoot }
