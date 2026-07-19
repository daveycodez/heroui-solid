import { type AvatarVariants, avatarVariants, cn } from "@heroui/styles"
import { Image } from "@kobalte/core/image"
import {
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

/* ------------------------------------------------------------------------------------------------
 * Avatar Context
 * --------------------------------------------------------------------------------------------- */
type AvatarContextValue = {
  slots?: ReturnType<typeof avatarVariants>
}

const AvatarContext = createContext<AvatarContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Avatar Root
 * -----------------------------------------------------------------------------------------------*/
type AvatarRootProps<T extends ValidComponent = "span"> = ComponentProps<
  typeof Image<T>
> &
  AvatarVariants

const AvatarRoot = <T extends ValidComponent = "span">(
  props: AvatarRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as AvatarRootProps,
    avatarVariants.variantKeys,
    ["class"]
  )
  const slots = createMemo(() => avatarVariants(variantProps))

  return (
    <AvatarContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <Image class={cn(slots().base(), local.class)} {...rest} />
    </AvatarContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Avatar Image
 * -----------------------------------------------------------------------------------------------*/
type AvatarImageProps<T extends ValidComponent = "img"> = ComponentProps<
  typeof Image.Img<T>
>

const AvatarImage = <T extends ValidComponent = "img">(
  props: AvatarImageProps<T>
) => {
  const [local, rest] = splitProps(props as AvatarImageProps, ["class"])
  const context = useContext(AvatarContext)

  return <Image.Img class={cn(context.slots?.image(), local.class)} {...rest} />
}

/* -------------------------------------------------------------------------------------------------
 * Avatar Fallback
 * -----------------------------------------------------------------------------------------------*/
type AvatarFallbackProps<T extends ValidComponent = "span"> = ComponentProps<
  typeof Image.Fallback<T>
> & {
  color?: AvatarVariants["color"]
}

const AvatarFallback = <T extends ValidComponent = "span">(
  props: AvatarFallbackProps<T>
) => {
  const [local, rest] = splitProps(props as AvatarFallbackProps, [
    "class",
    "color"
  ])
  const context = useContext(AvatarContext)

  return (
    <Image.Fallback
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
