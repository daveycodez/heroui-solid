import type { ComponentProps } from "solid-js"

import { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Avatar = Object.assign(AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback
})

export type Avatar = {
  Props: ComponentProps<typeof AvatarRoot>
  RootProps: ComponentProps<typeof AvatarRoot>
  ImageProps: ComponentProps<typeof AvatarImage>
  FallbackProps: ComponentProps<typeof AvatarFallback>
}

export type { AvatarVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { avatarVariants } from "@heroui/styles"
export type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarRootProps,
  AvatarRootProps as AvatarProps
} from "./avatar"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar"
