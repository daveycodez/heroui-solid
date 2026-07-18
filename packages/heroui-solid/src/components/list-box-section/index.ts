import type { ComponentProps } from "solid-js"

import { ListBoxSectionRoot } from "./list-box-section"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const ListBoxSection = ListBoxSectionRoot

export type ListBoxSection = {
  Props: ComponentProps<typeof ListBoxSectionRoot>
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { listboxSectionVariants } from "@heroui/styles"
export type {
  ListBoxSectionRootProps,
  ListBoxSectionRootProps as ListBoxSectionProps
} from "./list-box-section"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { ListBoxSectionRoot } from "./list-box-section"
