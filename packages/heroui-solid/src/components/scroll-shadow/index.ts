import type { ComponentProps } from "solid-js"

import { ScrollShadowRoot } from "./scroll-shadow"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ScrollShadow = Object.assign(ScrollShadowRoot, {
  Root: ScrollShadowRoot
})

export type ScrollShadow = {
  Props: ComponentProps<typeof ScrollShadowRoot>
  RootProps: ComponentProps<typeof ScrollShadowRoot>
}

export type { ScrollShadowVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { scrollShadowVariants } from "@heroui/styles"
export type {
  ScrollShadowRootProps,
  ScrollShadowRootProps as ScrollShadowProps,
  ScrollShadowVisibility
} from "./scroll-shadow"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ScrollShadowRoot } from "./scroll-shadow"
