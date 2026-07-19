import {
  AccordionContent,
  type AccordionContentProps,
  AccordionHeader,
  type AccordionHeaderProps,
  AccordionItem,
  type AccordionItemProps,
  AccordionRoot,
  type AccordionRootProps,
  AccordionTrigger,
  type AccordionTriggerProps
} from "./accordion"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Accordion = Object.assign(AccordionRoot, {
  Content: AccordionContent,
  Header: AccordionHeader,
  Item: AccordionItem,
  Trigger: AccordionTrigger
})

export type Accordion = {
  Props: AccordionRootProps
  ContentProps: AccordionContentProps
  HeaderProps: AccordionHeaderProps
  ItemProps: AccordionItemProps
  TriggerProps: AccordionTriggerProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { AccordionVariants } from "@heroui/styles"
export { accordionVariants } from "@heroui/styles"
