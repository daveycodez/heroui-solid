import { type CardVariants, cardVariants, cn } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  createMemo,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { SurfaceContext } from "../surface/surface"

/* -------------------------------------------------------------------------------------------------
 * Card Context
 * -----------------------------------------------------------------------------------------------*/
interface CardContextValue {
  slots?: ReturnType<typeof cardVariants>
}

const CardContext = createContext<CardContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Card Root
 * -----------------------------------------------------------------------------------------------*/
interface CardRootProps {
  children?: JSX.Element
  class?: string
  variant?: CardVariants["variant"]
}

const CardRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CardRootProps>
) => {
  const [local, rest] = splitProps(props as CardRootProps, ["class", "variant"])
  const outerSurface = useContext(SurfaceContext)
  const slots = createMemo(() =>
    cardVariants({ variant: local.variant ?? "default" })
  )

  return (
    <CardContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      {/* Allows inner components to apply "on-surface" colors for proper contrast */}
      <SurfaceContext.Provider
        value={{
          get variant() {
            // Transparent cards establish no surface (upstream skips the provider there).
            return local.variant === "transparent"
              ? outerSurface.variant
              : (local.variant ?? "default")
          }
        }}
      >
        <Polymorphic
          as="div"
          class={cn(slots().base(), local.class)}
          data-slot="card"
          {...rest}
        />
      </SurfaceContext.Provider>
    </CardContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Card Header
 * -----------------------------------------------------------------------------------------------*/
interface CardHeaderProps {
  children?: JSX.Element
  class?: string
}

const CardHeader = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CardHeaderProps>
) => {
  const [local, rest] = splitProps(props as CardHeaderProps, ["class"])
  const context = useContext(CardContext)

  return (
    <Polymorphic
      as="div"
      class={cn(context.slots?.header(), local.class)}
      data-slot="card-header"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Card Title
 * -----------------------------------------------------------------------------------------------*/
interface CardTitleProps {
  children?: JSX.Element
  class?: string
}

const CardTitle = <T extends ValidComponent = "h3">(
  props: PolymorphicProps<T, CardTitleProps>
) => {
  const [local, rest] = splitProps(props as CardTitleProps, ["class"])
  const context = useContext(CardContext)

  return (
    <Polymorphic
      as="h3"
      class={cn(context.slots?.title(), local.class)}
      data-slot="card-title"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Card Description
 * -----------------------------------------------------------------------------------------------*/
interface CardDescriptionProps {
  children?: JSX.Element
  class?: string
}

const CardDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, CardDescriptionProps>
) => {
  const [local, rest] = splitProps(props as CardDescriptionProps, ["class"])
  const context = useContext(CardContext)

  return (
    <Polymorphic
      as="p"
      class={cn(context.slots?.description(), local.class)}
      data-slot="card-description"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Card Content
 * -----------------------------------------------------------------------------------------------*/
interface CardContentProps {
  children?: JSX.Element
  class?: string
}

const CardContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CardContentProps>
) => {
  const [local, rest] = splitProps(props as CardContentProps, ["class"])
  const context = useContext(CardContext)

  return (
    <Polymorphic
      as="div"
      class={cn(context.slots?.content(), local.class)}
      data-slot="card-content"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Card Footer
 * -----------------------------------------------------------------------------------------------*/
interface CardFooterProps {
  children?: JSX.Element
  class?: string
}

const CardFooter = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CardFooterProps>
) => {
  const [local, rest] = splitProps(props as CardFooterProps, ["class"])
  const context = useContext(CardContext)

  return (
    <Polymorphic
      as="div"
      class={cn(context.slots?.footer(), local.class)}
      data-slot="card-footer"
      {...rest}
    />
  )
}

export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardRootProps,
  CardTitleProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle
}
