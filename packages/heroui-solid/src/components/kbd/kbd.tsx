import { cn, type KbdVariants, kbdVariants } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { type JSX, splitProps, type ValidComponent } from "solid-js"

import { type KbdKey, kbdKeysLabelMap, kbdKeysMap } from "./kbd.constants"

/* -------------------------------------------------------------------------------------------------
 * Kbd Root
 * -----------------------------------------------------------------------------------------------*/
interface KbdRootProps extends KbdVariants {
  class?: string
  children?: JSX.Element
}

const KbdRoot = <T extends ValidComponent = "kbd">(
  props: PolymorphicProps<T, KbdRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as KbdRootProps,
    kbdVariants.variantKeys,
    ["class"]
  )

  return (
    <Polymorphic
      as="kbd"
      class={cn(kbdVariants(variantProps).base(), local.class)}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Kbd Abbr
 * -----------------------------------------------------------------------------------------------*/
interface KbdAbbrProps {
  class?: string
  keyValue: KbdKey
}

const KbdAbbr = <T extends ValidComponent = "abbr">(
  props: PolymorphicProps<T, KbdAbbrProps>
) => {
  const [local, rest] = splitProps(props as KbdAbbrProps, ["class", "keyValue"])

  return (
    <Polymorphic
      as="abbr"
      class={cn(kbdVariants().abbr(), local.class)}
      title={kbdKeysLabelMap[local.keyValue]}
      {...rest}
    >
      {kbdKeysMap[local.keyValue]}
    </Polymorphic>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Kbd Content
 * -----------------------------------------------------------------------------------------------*/
interface KbdContentProps {
  class?: string
  children?: JSX.Element
}

const KbdContent = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, KbdContentProps>
) => {
  const [local, rest] = splitProps(props as KbdContentProps, ["class"])

  return (
    <Polymorphic
      as="span"
      class={cn(kbdVariants().content(), local.class)}
      {...rest}
    />
  )
}

export type { KbdAbbrProps, KbdContentProps, KbdRootProps }
export { KbdAbbr, KbdContent, KbdRoot }
