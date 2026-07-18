import type { ComponentProps } from "solid-js"

import { TagRemoveButton, TagRoot } from "./tag"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Tag = Object.assign(TagRoot, {
  Root: TagRoot,
  RemoveButton: TagRemoveButton
})

export type Tag = {
  Props: ComponentProps<typeof TagRoot>
  RootProps: ComponentProps<typeof TagRoot>
  RemoveButtonProps: ComponentProps<typeof TagRemoveButton>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { tagVariants } from "@heroui/styles"
export type {
  TagContextValue,
  TagRemoveButtonProps,
  TagRenderProps,
  TagRootProps,
  TagRootProps as TagProps
} from "./tag"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { TagContext, TagRemoveButton, TagRoot } from "./tag"
