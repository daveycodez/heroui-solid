import {
  AvatarFallback,
  type AvatarFallbackProps,
  AvatarImage,
  type AvatarImageProps,
  AvatarRoot,
  type AvatarRootProps
} from "./avatar"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback
})

export type Avatar = {
  Props: AvatarRootProps
  ImageProps: AvatarImageProps
  FallbackProps: AvatarFallbackProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { AvatarVariants } from "@heroui/styles"
export { avatarVariants } from "@heroui/styles"
