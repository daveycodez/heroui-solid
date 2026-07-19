import { type AccordionVariants, accordionVariants, cn } from "@heroui/styles"
import { Accordion } from "@kobalte/core/accordion"
import { type ComponentProps, splitProps, type ValidComponent } from "solid-js"
import { IconChevronDown } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * Accordion Root
 * -----------------------------------------------------------------------------------------------*/
type AccordionRootProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof Accordion<T>
> &
  AccordionVariants & {
    hideSeparator?: boolean
  }

const AccordionRoot = <T extends ValidComponent = "div">(
  props: AccordionRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as AccordionRootProps,
    accordionVariants.variantKeys,
    ["class", "hideSeparator"]
  )

  return (
    <Accordion
      class={cn(accordionVariants(variantProps).base(), local.class)}
      data-slot="accordion"
      data-hide-separator={local.hideSeparator ? "true" : undefined}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/
type AccordionItemProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof Accordion.Item<T>
>

const AccordionItem = <T extends ValidComponent = "div">(
  props: AccordionItemProps<T>
) => {
  const [local, rest] = splitProps(props as AccordionItemProps, ["class"])
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
      {local.children ?? <IconChevronDown aria-hidden="true" />}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionHeader
 * -----------------------------------------------------------------------------------------------*/
type AccordionHeaderProps<T extends ValidComponent = "h3"> = ComponentProps<
  typeof Accordion.Header<T>
>

const AccordionHeader = <T extends ValidComponent = "h3">(
  props: AccordionHeaderProps<T>
) => {
  const [local, rest] = splitProps(props as AccordionHeaderProps, ["class"])
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
type AccordionTriggerProps<T extends ValidComponent = "button"> =
  ComponentProps<typeof Accordion.Trigger<T>>

const AccordionTrigger = <T extends ValidComponent = "button">(
  props: AccordionTriggerProps<T>
) => {
  const [local, rest] = splitProps(props as AccordionTriggerProps, ["class"])
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
type AccordionContentProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof Accordion.Content<T>
>

const AccordionContent = <T extends ValidComponent = "div">(
  props: AccordionContentProps<T>
) => {
  const [local, rest] = splitProps(props as AccordionContentProps, [
    "class",
    "style",
    "children"
  ])
  // The panel is the element whose height animates, so it stays padding-free —
  // padding on an animated-height element reflows and jitters on collapse.
  // Body padding lives on an inner wrapper (upstream's panel > body > bodyInner
  // structure, folded into the component so demos still pass content directly).
  // The caller's `class`/`style` go on that inner wrapper so they can override
  // the padding/text styling; Kobalte keeps the panel (it owns the height var).
  return (
    <Accordion.Content
      class={accordionVariants().panel()}
      data-slot="accordion-panel"
      {...rest}
    >
      <div
        class={cn(
          accordionVariants().body(),
          accordionVariants().bodyInner(),
          local.class
        )}
        style={local.style}
      >
        {local.children}
      </div>
    </Accordion.Content>
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
