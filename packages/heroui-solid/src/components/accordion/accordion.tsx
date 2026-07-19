import { Accordion } from "@kobalte/core/accordion"
import type { ComponentProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Accordion Root
 * -----------------------------------------------------------------------------------------------*/
interface AccordionRootProps extends ComponentProps<typeof Accordion> {}

const AccordionRoot = (props: AccordionRootProps) => {
  return <Accordion {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/
interface AccordionItemProps extends ComponentProps<typeof Accordion.Item> {}

const AccordionItem = (props: AccordionItemProps) => {
  return <Accordion.Item {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/
interface AccordionHeaderProps
  extends ComponentProps<typeof Accordion.Header> {}

const AccordionHeader = (props: AccordionHeaderProps) => {
  return <Accordion.Header {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/
interface AccordionTriggerProps
  extends ComponentProps<typeof Accordion.Trigger> {}

const AccordionTrigger = (props: AccordionTriggerProps) => {
  return <Accordion.Trigger {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * AccordionContent
 * -----------------------------------------------------------------------------------------------*/
interface AccordionContentProps
  extends ComponentProps<typeof Accordion.Content> {}

const AccordionContent = (props: AccordionContentProps) => {
  return <Accordion.Content {...props} />
}

export type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionRootProps,
  AccordionTriggerProps
}

export {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
}
