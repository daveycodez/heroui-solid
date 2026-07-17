import type { ComponentProps } from "solid-js"

import { LinkIcon, LinkRoot } from "./link"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Link = Object.assign(LinkRoot, {
  Root: LinkRoot,
  Icon: LinkIcon
})

export type Link = {
  Props: ComponentProps<typeof LinkRoot>
  RootProps: ComponentProps<typeof LinkRoot>
  IconProps: ComponentProps<typeof LinkIcon>
}

export type { LinkVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { linkVariants } from "@heroui/styles"
export type {
  LinkIconProps,
  LinkRootProps,
  LinkRootProps as LinkProps
} from "./link"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { LinkIcon, LinkRoot }
