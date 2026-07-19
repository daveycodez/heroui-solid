import {
  LinkIcon,
  type LinkIconProps,
  LinkRoot,
  type LinkRootProps
} from "./link"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Link = Object.assign(LinkRoot, {
  Icon: LinkIcon
})

export type Link = {
  Props: LinkRootProps
  IconProps: LinkIconProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
// Link has no variants; only the styling fn is re-exported (no LinkVariants type).
export { linkVariants } from "@heroui/styles"
