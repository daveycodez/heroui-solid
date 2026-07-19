import { cn, type KbdVariants, kbdVariants } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  createMemo,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { type KbdKey, kbdKeysLabelMap, kbdKeysMap } from "./kbd.constants"

/* -------------------------------------------------------------------------------------------------
 * Kbd Context
 * -----------------------------------------------------------------------------------------------*/
type KbdContextValue = {
  slots?: ReturnType<typeof kbdVariants>
}

const KbdContext = createContext<KbdContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Kbd Root
 * -----------------------------------------------------------------------------------------------*/
type KbdRootProps<T extends ValidComponent = "kbd"> = PolymorphicProps<
  T,
  KbdVariants
>

const KbdRoot = <T extends ValidComponent = "kbd">(props: KbdRootProps<T>) => {
  const [variantProps, local, rest] = splitProps(
    props as KbdRootProps,
    kbdVariants.variantKeys,
    ["class"]
  )
  const slots = createMemo(() => kbdVariants(variantProps))

  return (
    <KbdContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <Polymorphic as="kbd" class={cn(slots().base(), local.class)} {...rest} />
    </KbdContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Kbd Abbr
 * -----------------------------------------------------------------------------------------------*/
type KbdAbbrProps<T extends ValidComponent = "abbr"> = PolymorphicProps<
  T,
  { keyValue: KbdKey }
>

const KbdAbbr = <T extends ValidComponent = "abbr">(props: KbdAbbrProps<T>) => {
  const [local, rest] = splitProps(props as KbdAbbrProps, ["class", "keyValue"])
  const context = useContext(KbdContext)

  return (
    <Polymorphic
      as="abbr"
      class={cn(context.slots?.abbr(), local.class)}
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
type KbdContentProps<T extends ValidComponent = "span"> = PolymorphicProps<T>

const KbdContent = <T extends ValidComponent = "span">(
  props: KbdContentProps<T>
) => {
  const [local, rest] = splitProps(props as KbdContentProps, ["class"])
  const context = useContext(KbdContext)

  return (
    <Polymorphic
      as="span"
      class={cn(context.slots?.content(), local.class)}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { KbdAbbrProps, KbdContentProps, KbdRootProps }
export { KbdAbbr, KbdContent, KbdRoot }
