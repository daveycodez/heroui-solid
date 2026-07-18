import type { ComponentProps } from "solid-js"

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle
} from "./card"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
})

export type Card = {
  Props: ComponentProps<typeof CardRoot>
  RootProps: ComponentProps<typeof CardRoot>
  HeaderProps: ComponentProps<typeof CardHeader>
  TitleProps: ComponentProps<typeof CardTitle>
  DescriptionProps: ComponentProps<typeof CardDescription>
  ContentProps: ComponentProps<typeof CardContent>
  FooterProps: ComponentProps<typeof CardFooter>
}

export type { CardVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { cardVariants } from "@heroui/styles"
export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardRootProps,
  CardRootProps as CardProps,
  CardTitleProps
} from "./card"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle
}
