import type { ComponentProps } from "solid-js"

import {
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from "./alert"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Indicator: AlertIndicator,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription
})

export type Alert = {
  Props: ComponentProps<typeof AlertRoot>
  RootProps: ComponentProps<typeof AlertRoot>
  IndicatorProps: ComponentProps<typeof AlertIndicator>
  ContentProps: ComponentProps<typeof AlertContent>
  TitleProps: ComponentProps<typeof AlertTitle>
  DescriptionProps: ComponentProps<typeof AlertDescription>
}

export type { AlertVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { alertVariants } from "@heroui/styles"
export type {
  AlertContentProps,
  AlertContextValue,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertRootProps,
  AlertRootProps as AlertProps,
  AlertTitleProps
} from "./alert"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  AlertContent,
  AlertContext,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
} from "./alert"
