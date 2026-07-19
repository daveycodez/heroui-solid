import type { ComponentProps } from "solid-js"

import {
  SurfaceContext,
  type SurfaceContextValue,
  SurfaceRoot
} from "./surface"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Surface = Object.assign(SurfaceRoot, {
  Root: SurfaceRoot
})

export type Surface = {
  Props: ComponentProps<typeof SurfaceRoot>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { SurfaceVariants } from "@heroui/styles"
export { surfaceVariants } from "@heroui/styles"
export type { SurfaceContextValue }
/* -------------------------------------------------------------------------------------------------
 * Surface Context
 * -----------------------------------------------------------------------------------------------*/
// Public: consumed by Card and provided by overlays to signal on-surface content.
export { SurfaceContext }
