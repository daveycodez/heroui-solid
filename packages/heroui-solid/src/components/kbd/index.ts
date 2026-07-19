import {
  KbdAbbr,
  type KbdAbbrProps,
  KbdContent,
  type KbdContentProps,
  KbdRoot,
  type KbdRootProps
} from "./kbd"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Kbd = Object.assign(KbdRoot, {
  Root: KbdRoot,
  Abbr: KbdAbbr,
  Content: KbdContent
})

export type Kbd = {
  Props: KbdRootProps
  AbbrProps: KbdAbbrProps
  ContentProps: KbdContentProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { KbdVariants } from "@heroui/styles"
export { kbdVariants } from "@heroui/styles"
export type { KbdKey } from "./kbd.constants"
