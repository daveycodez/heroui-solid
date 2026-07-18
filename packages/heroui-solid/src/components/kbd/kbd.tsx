import { cn, type KbdVariants, kbdVariants } from "@heroui/styles"
import {
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext
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
interface KbdRootProps extends ComponentProps<"kbd"> {
  variant?: KbdVariants["variant"]
}

const KbdRoot = (props: KbdRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
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
      <kbd class={cn(slots().base(), local.class)} {...rest} />
    </KbdContext.Provider>
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
  const context = useContext(KbdContext)

  return (
    <abbr
      class={cn(context.slots?.abbr(), local.class)}
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
  const context = useContext(KbdContext)

  return <span class={cn(context.slots?.content(), local.class)} {...rest} />
}

export type { KbdAbbrProps, KbdContentProps, KbdRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { KbdAbbr, KbdContent, KbdRoot }
