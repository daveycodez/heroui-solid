import {
  SurfaceContext,
  type SurfaceContextValue,
  SurfaceRoot,
  type SurfaceRootProps
} from "./surface"

/* -------------------------------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------------------------*/
export const Surface = SurfaceRoot

export type Surface = {
  Props: SurfaceRootProps
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
