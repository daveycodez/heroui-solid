import { type CardVariants, cardVariants, cn } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  createMemo,
  Show,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { SurfaceContext } from "../surface/surface"

/* -------------------------------------------------------------------------------------------------
 * Card Context
 * -----------------------------------------------------------------------------------------------*/
type CardContextValue = {
  slots?: ReturnType<typeof cardVariants>
}

const CardContext = createContext<CardContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Card Root
 * -----------------------------------------------------------------------------------------------*/
type CardRootProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  CardVariants
>

const CardRoot = <T extends ValidComponent = "div">(
  props: CardRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as CardRootProps,
    cardVariants.variantKeys,
    ["class"]
  )
  const slots = createMemo(() => cardVariants(variantProps))

  // Upstream reuses a single `content` element across both branches. In Solid,
  // context resolves by owner at creation, so the body must be *created inside*
  // the providers below (a hoisted element would read an empty CardContext) — a
  // local component does that. Only the active Show branch instantiates it, so
  // children stay a single read.
  const CardBody = () => (
    <Polymorphic
      as="div"
      class={cn(slots().base(), local.class)}
      data-slot="card"
      {...rest}
    />
  )

  return (
    <CardContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      {/* Transparent cards establish no surface: upstream renders content bare so
          inner parts inherit the ancestor surface; others provide their variant
          so inner components pick "on-surface" colors for proper contrast. */}
      <Show
        when={variantProps.variant !== "transparent"}
        fallback={<CardBody />}
      >
        <SurfaceContext.Provider
          value={{
            get variant() {
              return variantProps.variant ?? "default"
            }
          }}
        >
          <CardBody />
        </SurfaceContext.Provider>
      </Show>
    </CardContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Card Header
 * -----------------------------------------------------------------------------------------------*/
type CardHeaderProps<T extends ValidComponent = "div"> = PolymorphicProps<T>

const CardHeader = <T extends ValidComponent = "div">(
  props: CardHeaderProps<T>
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
type CardTitleProps<T extends ValidComponent = "h3"> = PolymorphicProps<T>

const CardTitle = <T extends ValidComponent = "h3">(
  props: CardTitleProps<T>
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
type CardDescriptionProps<T extends ValidComponent = "p"> = PolymorphicProps<T>

const CardDescription = <T extends ValidComponent = "p">(
  props: CardDescriptionProps<T>
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
type CardContentProps<T extends ValidComponent = "div"> = PolymorphicProps<T>

const CardContent = <T extends ValidComponent = "div">(
  props: CardContentProps<T>
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
type CardFooterProps<T extends ValidComponent = "div"> = PolymorphicProps<T>

const CardFooter = <T extends ValidComponent = "div">(
  props: CardFooterProps<T>
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

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardRootProps,
  CardTitleProps
}
export {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle
}
