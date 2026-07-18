import type { ComponentProps } from "solid-js"

import { ListBoxSectionRoot } from "../list-box-section/list-box-section"
import { ListBoxItem, ListBoxItemIndicator, ListBoxRoot } from "./list-box"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ListBox = Object.assign(ListBoxRoot, {
  Root: ListBoxRoot,
  Item: ListBoxItem,
  ItemIndicator: ListBoxItemIndicator,
  Section: ListBoxSectionRoot
})

export type ListBox = {
  Props: ComponentProps<typeof ListBoxRoot>
  RootProps: ComponentProps<typeof ListBoxRoot>
  ItemProps: ComponentProps<typeof ListBoxItem>
  ItemIndicatorProps: ComponentProps<typeof ListBoxItemIndicator>
  SectionProps: ComponentProps<typeof ListBoxSectionRoot>
}

export type { ListBoxVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { listboxItemVariants, listboxVariants } from "@heroui/styles"
export type {
  ListBoxItemIndicatorProps,
  ListBoxItemProps,
  ListBoxRootProps,
  ListBoxRootProps as ListBoxProps
} from "./list-box"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ListBoxItem, ListBoxItemIndicator, ListBoxRoot }
