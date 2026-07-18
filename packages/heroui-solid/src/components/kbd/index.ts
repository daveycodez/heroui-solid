import type { ComponentProps } from "solid-js"

import { KbdAbbr, KbdContent, KbdRoot } from "./kbd"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Kbd = Object.assign(KbdRoot, {
  Root: KbdRoot,
  Abbr: KbdAbbr,
  Content: KbdContent
})

export type Kbd = {
  Props: ComponentProps<typeof KbdRoot>
  RootProps: ComponentProps<typeof KbdRoot>
  AbbrProps: ComponentProps<typeof KbdAbbr>
  ContentProps: ComponentProps<typeof KbdContent>
}

export type { KbdVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { kbdVariants } from "@heroui/styles"
export type {
  KbdAbbrProps,
  KbdContentProps,
  KbdRootProps,
  KbdRootProps as KbdProps
} from "./kbd"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { KbdAbbr, KbdContent, KbdRoot } from "./kbd"
export type { KbdKey } from "./kbd.constants"
export { kbdKeysLabelMap, kbdKeysMap } from "./kbd.constants"
