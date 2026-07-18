import type { ComponentProps } from "solid-js"

import { EmptyStateRoot } from "./empty-state"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const EmptyState = Object.assign(EmptyStateRoot, {
  Root: EmptyStateRoot
})

export type EmptyState = {
  Props: ComponentProps<typeof EmptyStateRoot>
  RootProps: ComponentProps<typeof EmptyStateRoot>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { emptyStateVariants } from "@heroui/styles"
export type {
  EmptyStateRootProps,
  EmptyStateRootProps as EmptyStateProps
} from "./empty-state"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { EmptyStateRoot } from "./empty-state"
