import type { ComponentProps } from "solid-js"

import {
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger
} from "./accordion"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Heading: AccordionHeading,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
  Indicator: AccordionIndicator,
  Body: AccordionBody
})

export type Accordion = {
  Props: ComponentProps<typeof AccordionRoot>
  RootProps: ComponentProps<typeof AccordionRoot>
  ItemProps: ComponentProps<typeof AccordionItem>
  HeadingProps: ComponentProps<typeof AccordionHeading>
  TriggerProps: ComponentProps<typeof AccordionTrigger>
  PanelProps: ComponentProps<typeof AccordionPanel>
  IndicatorProps: ComponentProps<typeof AccordionIndicator>
  BodyProps: ComponentProps<typeof AccordionBody>
}

export type { AccordionVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { accordionVariants } from "@heroui/styles"
export type {
  AccordionBodyProps,
  AccordionHeadingProps,
  AccordionIndicatorProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionRootProps as AccordionProps,
  AccordionTriggerProps
} from "./accordion"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger
}
