import {
  CardContent,
  type CardContentProps,
  CardDescription,
  type CardDescriptionProps,
  CardFooter,
  type CardFooterProps,
  CardHeader,
  type CardHeaderProps,
  CardRoot,
  type CardRootProps,
  CardTitle,
  type CardTitleProps
} from "./card"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
})

export type Card = {
  Props: CardRootProps
  HeaderProps: CardHeaderProps
  TitleProps: CardTitleProps
  DescriptionProps: CardDescriptionProps
  ContentProps: CardContentProps
  FooterProps: CardFooterProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { CardVariants } from "@heroui/styles"
export { cardVariants } from "@heroui/styles"
