import type { ComponentProps } from "solid-js"

import {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot,
  AlertDialogTrigger
} from "./alert-dialog"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const AlertDialog = Object.assign(AlertDialogRoot, {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Backdrop: AlertDialogBackdrop,
  Container: AlertDialogContainer,
  Dialog: AlertDialogDialog,
  Header: AlertDialogHeader,
  Heading: AlertDialogHeading,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Icon: AlertDialogIcon,
  CloseTrigger: AlertDialogCloseTrigger
})

export type AlertDialog = {
  Props: ComponentProps<typeof AlertDialogRoot>
  RootProps: ComponentProps<typeof AlertDialogRoot>
  TriggerProps: ComponentProps<typeof AlertDialogTrigger>
  BackdropProps: ComponentProps<typeof AlertDialogBackdrop>
  ContainerProps: ComponentProps<typeof AlertDialogContainer>
  DialogProps: ComponentProps<typeof AlertDialogDialog>
  HeaderProps: ComponentProps<typeof AlertDialogHeader>
  HeadingProps: ComponentProps<typeof AlertDialogHeading>
  BodyProps: ComponentProps<typeof AlertDialogBody>
  FooterProps: ComponentProps<typeof AlertDialogFooter>
  IconProps: ComponentProps<typeof AlertDialogIcon>
  CloseTriggerProps: ComponentProps<typeof AlertDialogCloseTrigger>
}

export type { AlertDialogVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { alertDialogVariants } from "@heroui/styles"
export type {
  AlertDialogBackdropProps,
  AlertDialogBodyProps,
  AlertDialogCloseTriggerProps,
  AlertDialogContainerProps,
  AlertDialogDialogProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogHeadingProps,
  AlertDialogIconProps,
  AlertDialogPlacement,
  AlertDialogRootProps,
  AlertDialogRootProps as AlertDialogProps,
  AlertDialogStatus,
  AlertDialogTriggerProps
} from "./alert-dialog"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot,
  AlertDialogTrigger
} from "./alert-dialog"
/* -------------------------------------------------------------------------------------------------
 * Overlay State Hook
 * -----------------------------------------------------------------------------------------------*/
export type { OverlayState, UseOverlayStateProps } from "./use-overlay-state"
export { useOverlayState } from "./use-overlay-state"
