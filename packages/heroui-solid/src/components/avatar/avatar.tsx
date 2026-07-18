import { type AvatarVariants, avatarVariants, cn } from "@heroui/styles"
import {
  Fallback as ImageFallbackPrimitive,
  Img as ImageImgPrimitive,
  Root as ImagePrimitive
} from "@kobalte/core/image"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  createMemo,
  createSignal,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

/* ------------------------------------------------------------------------------------------------
 * Avatar Context
 * --------------------------------------------------------------------------------------------- */
type AvatarContextValue = {
  slots?: ReturnType<typeof avatarVariants>
  setFallbackDelay?: (delayMs: number | undefined) => void
}

const AvatarContext = createContext<AvatarContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Avatar Root
 * -----------------------------------------------------------------------------------------------*/
interface AvatarRootProps extends AvatarVariants {
  class?: string
  children?: JSX.Element
}

const AvatarRoot = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as AvatarRootProps,
    avatarVariants.variantKeys,
    ["class"]
  )
  const slots = createMemo(() => avatarVariants(variantProps))
  // Upstream's Radix API takes delayMs on the Fallback; Kobalte's Image takes
  // fallbackDelay on the root — the fallback registers its delay here.
  const [fallbackDelay, setFallbackDelay] = createSignal<number>()

  return (
    <AvatarContext.Provider
      value={{
        get slots() {
          return slots()
        },
        setFallbackDelay
      }}
    >
      <ImagePrimitive
        class={cn(slots().base(), local.class)}
        fallbackDelay={fallbackDelay()}
        {...rest}
      />
    </AvatarContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Avatar Image
 * -----------------------------------------------------------------------------------------------*/
interface AvatarImageProps {
  class?: string
  src?: string
  alt?: string
}

const AvatarImage = <T extends ValidComponent = "img">(
  props: PolymorphicProps<T, AvatarImageProps>
) => {
  const [local, rest] = splitProps(props as AvatarImageProps, ["class"])
  const context = useContext(AvatarContext)

  return (
    <ImageImgPrimitive
      class={cn(context.slots?.image(), local.class)}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Avatar Fallback
 * -----------------------------------------------------------------------------------------------*/
interface AvatarFallbackProps {
  color?: AvatarVariants["color"]
  delayMs?: number
  class?: string
  children?: JSX.Element
}

const AvatarFallback = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarFallbackProps>
) => {
  const [local, rest] = splitProps(props as AvatarFallbackProps, [
    "color",
    "delayMs",
    "class"
  ])
  const context = useContext(AvatarContext)
  if (local.delayMs !== undefined) {
    context.setFallbackDelay?.(local.delayMs)
  }

  return (
    <ImageFallbackPrimitive
      class={cn(context.slots?.fallback({ color: local.color }), local.class)}
      data-slot="avatar-fallback"
      {...rest}
    />
  )
}

export type { AvatarFallbackProps, AvatarImageProps, AvatarRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { AvatarFallback, AvatarImage, AvatarRoot }
