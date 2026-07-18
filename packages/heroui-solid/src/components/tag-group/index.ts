import type { ComponentProps } from "solid-js"

import { TagGroupList, TagGroupRoot } from "./tag-group"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const TagGroup = Object.assign(TagGroupRoot, {
  Root: TagGroupRoot,
  List: TagGroupList
})

export type TagGroup = {
  Props: ComponentProps<typeof TagGroupRoot>
  RootProps: ComponentProps<typeof TagGroupRoot>
  ListProps: ComponentProps<typeof TagGroupList>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { tagGroupVariants } from "@heroui/styles"
export type {
  TagGroupContextValue,
  TagGroupListProps,
  TagGroupRootProps,
  TagGroupRootProps as TagGroupProps,
  TagKey,
  TagKey as Key,
  TagSelectionMode,
  TagSize,
  TagVariant
} from "./tag-group"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  TagGroupContext,
  TagGroupList,
  TagGroupRoot,
  useTagGroup
} from "./tag-group"
