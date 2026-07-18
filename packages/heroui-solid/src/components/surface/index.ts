import type { ComponentProps } from "solid-js"

import { SurfaceRoot } from "./surface"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Surface = Object.assign(SurfaceRoot, {
  Root: SurfaceRoot
})

export type Surface = {
  Props: ComponentProps<typeof SurfaceRoot>
  RootProps: ComponentProps<typeof SurfaceRoot>
}

export type { SurfaceVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { surfaceVariants } from "@heroui/styles"
export type {
  SurfaceContextValue,
  SurfaceRootProps,
  SurfaceRootProps as SurfaceProps
} from "./surface"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { SurfaceContext, SurfaceRoot } from "./surface"
