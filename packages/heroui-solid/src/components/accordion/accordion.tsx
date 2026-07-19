import { type AccordionVariants, accordionVariants, cn } from "@heroui/styles"
import { Accordion } from "@kobalte/core/accordion"
import {
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"
import { IconChevronDown } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * Accordion Context
 * -----------------------------------------------------------------------------------------------*/
type AccordionContextValue = {
  slots?: ReturnType<typeof accordionVariants>
  hideSeparator?: boolean
}

const AccordionContext = createContext<AccordionContextValue>({})

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
  const slots = createMemo(() => accordionVariants(variantProps))

  return (
    <AccordionContext.Provider
      value={{
        get slots() {
          return slots()
        },
        get hideSeparator() {
          return local.hideSeparator
        }
      }}
    >
      <Accordion
        class={cn(slots().base(), local.class)}
        data-slot="accordion"
        {...rest}
      />
    </AccordionContext.Provider>
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
  const context = useContext(AccordionContext)
  return (
    <Accordion.Item
      class={cn(context.slots?.item(), local.class)}
      data-slot="accordion-item"
      data-hide-separator={dataAttr(context.hideSeparator)}
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
  const context = useContext(AccordionContext)

  return (
    <span
      class={cn(context.slots?.indicator(), local.class)}
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
  const context = useContext(AccordionContext)
  return (
    <Accordion.Header
      class={cn(context.slots?.heading(), local.class)}
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
  const context = useContext(AccordionContext)
  return (
    <Accordion.Trigger
      class={cn(context.slots?.trigger(), local.class)}
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
  const context = useContext(AccordionContext)
  // The panel is the element whose height animates, so it stays padding-free —
  // padding on an animated-height element reflows and jitters on collapse.
  // Body padding lives on an inner wrapper (upstream's panel > body > bodyInner
  // structure, folded into the component so demos still pass content directly).
  // The caller's `class`/`style` go on that inner wrapper so they can override
  // the padding/text styling; Kobalte keeps the panel (it owns the height var).
  return (
    <Accordion.Content
      class={context.slots?.panel()}
      data-slot="accordion-panel"
      {...rest}
    >
      <div
        class={cn(
          context.slots?.body(),
          context.slots?.bodyInner(),
          local.class
        )}
        style={local.style}
      >
        {local.children}
      </div>
    </Accordion.Content>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
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
