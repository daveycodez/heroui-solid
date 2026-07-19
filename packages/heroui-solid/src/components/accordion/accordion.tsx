import { type AccordionVariants, accordionVariants, cn } from "@heroui/styles"
import { Accordion } from "@kobalte/core/accordion"
import { ChevronDown } from "gravity-icons-solid"
import { type ComponentProps, splitProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Accordion Root
 * -----------------------------------------------------------------------------------------------*/
interface AccordionRootProps
  extends ComponentProps<typeof Accordion>,
    AccordionVariants {}

const AccordionRoot = (props: AccordionRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    accordionVariants.variantKeys,
    ["class"]
  )
  return (
    <Accordion
      class={cn(accordionVariants(variantProps).base(), local.class)}
      data-slot="accordion"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/
interface AccordionItemProps extends ComponentProps<typeof Accordion.Item> {}

const AccordionItem = (props: AccordionItemProps) => {
  const [local, rest] = splitProps(props, ["class"])
  return (
    <Accordion.Item
      class={cn(accordionVariants().item(), local.class)}
      data-slot="accordion-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionIndicator
 * -----------------------------------------------------------------------------------------------*/
interface AccordionIndicatorProps extends ComponentProps<"span"> {}

const AccordionIndicator = (props: AccordionIndicatorProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])

  return (
    <span
      class={cn(accordionVariants().indicator(), local.class)}
      data-slot="accordion-indicator"
      {...rest}
    >
      {local.children ?? <ChevronDown />}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/
interface AccordionHeaderProps
  extends ComponentProps<typeof Accordion.Header> {}

const AccordionHeader = (props: AccordionHeaderProps) => {
  const [local, rest] = splitProps(props, ["class"])
  return (
    <Accordion.Header
      class={cn(accordionVariants().heading(), local.class)}
      data-slot="accordion-heading"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/
interface AccordionTriggerProps
  extends ComponentProps<typeof Accordion.Trigger> {}

const AccordionTrigger = (props: AccordionTriggerProps) => {
  const [local, rest] = splitProps(props, ["class"])
  return (
    <Accordion.Trigger
      class={cn(accordionVariants().trigger(), local.class)}
      data-slot="accordion-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionContent
 * -----------------------------------------------------------------------------------------------*/
interface AccordionContentProps
  extends ComponentProps<typeof Accordion.Content> {}

const AccordionContent = (props: AccordionContentProps) => {
  const [local, rest] = splitProps(props, ["class"])
  return (
    <Accordion.Content
      class={cn(accordionVariants().panel(), local.class)}
      data-slot="accordion-panel"
      {...rest}
    />
  )
}

export type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionIndicatorProps,
  AccordionItemProps,
  AccordionRootProps,
  AccordionTriggerProps
}

export {
  AccordionContent,
  AccordionHeader,
  AccordionIndicator,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
}
