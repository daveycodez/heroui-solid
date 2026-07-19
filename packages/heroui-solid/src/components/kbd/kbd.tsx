import { cn, type KbdVariants, kbdVariants } from "@heroui/styles"
import { type ComponentProps, splitProps } from "solid-js"

import { type KbdKey, kbdKeysLabelMap, kbdKeysMap } from "./kbd.constants"

/* -------------------------------------------------------------------------------------------------
 * Kbd Root
 * -----------------------------------------------------------------------------------------------*/
type KbdRootProps = ComponentProps<"kbd"> & KbdVariants

const KbdRoot = (props: KbdRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    kbdVariants.variantKeys,
    ["class"]
  )

  return (
    <kbd class={cn(kbdVariants(variantProps).base(), local.class)} {...rest} />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Kbd Abbr
 * -----------------------------------------------------------------------------------------------*/
interface KbdAbbrProps extends ComponentProps<"abbr"> {
  keyValue: KbdKey
}

const KbdAbbr = (props: KbdAbbrProps) => {
  const [local, rest] = splitProps(props, ["class", "keyValue"])

  return (
    <abbr
      class={cn(kbdVariants().abbr(), local.class)}
      title={kbdKeysLabelMap[local.keyValue]}
      {...rest}
    >
      {kbdKeysMap[local.keyValue]}
    </abbr>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Kbd Content
 * -----------------------------------------------------------------------------------------------*/
interface KbdContentProps extends ComponentProps<"span"> {}

const KbdContent = (props: KbdContentProps) => {
  const [local, rest] = splitProps(props, ["class"])

  return <span class={cn(kbdVariants().content(), local.class)} {...rest} />
}

export type { KbdAbbrProps, KbdContentProps, KbdRootProps }
export { KbdAbbr, KbdContent, KbdRoot }
