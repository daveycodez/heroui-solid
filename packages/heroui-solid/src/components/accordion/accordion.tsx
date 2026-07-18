import { type AccordionVariants, accordionVariants, cn } from "@heroui/styles"
import {
  Content as AccordionContentPrimitive,
  Header as AccordionHeaderPrimitive,
  Item as AccordionItemPrimitive,
  Root as AccordionRootPrimitive,
  Trigger as AccordionTriggerPrimitive,
  useAccordionContext
} from "@kobalte/core/accordion"
import { useCollapsibleContext } from "@kobalte/core/collapsible"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeRefs } from "@kobalte/utils"
import {
  type ComponentProps,
  children,
  createContext,
  createMemo,
  createUniqueId,
  type JSX,
  Show,
  splitProps,
  untrack,
  useContext,
  type ValidComponent
} from "solid-js"

import { createDisclosurePanel } from "../../utils/disclosure-panel"
import type { Key } from "../../utils/types"
import { SurfaceContext } from "../surface/surface"

/* -------------------------------------------------------------------------------------------------
 * Accordion Context
 * -----------------------------------------------------------------------------------------------*/
interface AccordionContextValue {
  slots?: ReturnType<typeof accordionVariants>
  hideSeparator?: boolean
  isDisabled?: boolean
}

const AccordionContext = createContext<AccordionContextValue>({})

interface AccordionItemContextValue {
  value: string
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: ""
})

/* -------------------------------------------------------------------------------------------------
 * Accordion Root
 * -----------------------------------------------------------------------------------------------*/
interface AccordionRootProps extends AccordionVariants {
  children?: JSX.Element
  class?: string
  expandedKeys?: Iterable<Key>
  defaultExpandedKeys?: Iterable<Key>
  onExpandedChange?: (keys: Set<Key>) => void
  allowsMultipleExpanded?: boolean
  isDisabled?: boolean
  hideSeparator?: boolean
}

const AccordionRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as AccordionRootProps,
    accordionVariants.variantKeys,
    [
      "class",
      "expandedKeys",
      "defaultExpandedKeys",
      "onExpandedChange",
      "allowsMultipleExpanded",
      "isDisabled",
      "hideSeparator"
    ]
  )
  const outerSurface = useContext(SurfaceContext)
  const slots = createMemo(() => accordionVariants(variantProps))

  const toValue = (keys: Iterable<Key> | undefined) =>
    keys === undefined ? undefined : Array.from(keys, String)

  return (
    <AccordionContext.Provider
      value={{
        get slots() {
          return slots()
        },
        get hideSeparator() {
          return local.hideSeparator ?? false
        },
        get isDisabled() {
          return local.isDisabled ?? false
        }
      }}
    >
      {/* Allows inner components to apply "on-surface" colors for proper contrast */}
      <SurfaceContext.Provider
        value={{
          get variant() {
            return variantProps.variant === "surface"
              ? "default"
              : outerSurface.variant
          }
        }}
      >
        <AccordionRootPrimitive
          class={cn(slots().base(), local.class)}
          collapsible
          data-slot="accordion"
          defaultValue={toValue(local.defaultExpandedKeys)}
          multiple={local.allowsMultipleExpanded}
          onChange={(value) => local.onExpandedChange?.(new Set<Key>(value))}
          value={toValue(local.expandedKeys)}
          {...rest}
        />
      </SurfaceContext.Provider>
    </AccordionContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionItem
 * -----------------------------------------------------------------------------------------------*/
interface AccordionItemProps {
  children?: JSX.Element
  class?: string
  id?: Key
  isDisabled?: boolean
}

const AccordionItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionItemProps>
) => {
  const [local, rest] = splitProps(props as AccordionItemProps, [
    "class",
    "id",
    "isDisabled"
  ])
  const context = useContext(AccordionContext)
  const defaultValue = createUniqueId()
  const value = () => (local.id != null ? String(local.id) : defaultValue)

  return (
    <AccordionItemContext.Provider
      value={{
        get value() {
          return value()
        }
      }}
    >
      <AccordionItemPrimitive
        class={cn(context.slots?.item(), local.class)}
        data-hide-separator={context.hideSeparator ? "true" : undefined}
        data-slot="accordion-item"
        disabled={context.isDisabled || local.isDisabled}
        forceMount
        value={value()}
        {...rest}
      />
    </AccordionItemContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionIndicator
 * -----------------------------------------------------------------------------------------------*/
const IconChevronDown = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    role="presentation"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

interface AccordionIndicatorProps extends ComponentProps<"svg"> {
  class?: string
  children?: JSX.Element
}

const AccordionIndicator = (props: AccordionIndicatorProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useContext(AccordionContext)
  const collapsibleContext = useCollapsibleContext()
  const resolved = children(() => local.children)

  return (
    <Show
      when={resolved()}
      fallback={
        <IconChevronDown
          class={cn(context.slots?.indicator(), local.class)}
          data-expanded={collapsibleContext.isOpen() ? "true" : undefined}
          data-slot="accordion-indicator"
          {...rest}
        />
      }
    >
      {/* Solid can't clone the custom icon like upstream; the wrapper carries the slot class */}
      <span
        class={cn(context.slots?.indicator(), local.class)}
        data-expanded={collapsibleContext.isOpen() ? "true" : undefined}
        data-slot="accordion-indicator"
        {...(rest as unknown as ComponentProps<"span">)}
      >
        {resolved()}
      </span>
    </Show>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionHeading
 * -----------------------------------------------------------------------------------------------*/
interface AccordionHeadingProps {
  children?: JSX.Element
  class?: string
}

const AccordionHeading = <T extends ValidComponent = "h3">(
  props: PolymorphicProps<T, AccordionHeadingProps>
) => {
  const [local, rest] = splitProps(props as AccordionHeadingProps, ["class"])
  const context = useContext(AccordionContext)

  return (
    <AccordionHeaderPrimitive
      class={cn(context.slots?.heading(), local.class)}
      data-slot="accordion-heading"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionTrigger
 * -----------------------------------------------------------------------------------------------*/
interface AccordionTriggerProps {
  children?: JSX.Element
  class?: string
}

const AccordionTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AccordionTriggerProps>
) => {
  const [local, rest] = splitProps(props as AccordionTriggerProps, ["class"])
  const context = useContext(AccordionContext)

  return (
    <AccordionTriggerPrimitive
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="accordion-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionBody
 * -----------------------------------------------------------------------------------------------*/
interface AccordionBodyProps {
  children?: JSX.Element
  class?: string
}

const AccordionBody = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionBodyProps>
) => {
  const [local, rest] = splitProps(props as AccordionBodyProps, [
    "class",
    "children"
  ])
  const context = useContext(AccordionContext)

  return (
    <Polymorphic
      as="div"
      class={context.slots?.body()}
      data-slot="accordion-body"
      {...rest}
    >
      <div class={cn(context.slots?.bodyInner(), local.class)}>
        {local.children}
      </div>
    </Polymorphic>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AccordionPanel
 * -----------------------------------------------------------------------------------------------*/
interface AccordionPanelProps {
  children?: JSX.Element
  class?: string
  ref?: HTMLElement | ((el: HTMLElement) => void)
}

const AccordionPanel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AccordionPanelProps>
) => {
  const [local, rest] = splitProps(props as AccordionPanelProps, [
    "class",
    "ref"
  ])
  const context = useContext(AccordionContext)
  const itemContext = useContext(AccordionItemContext)
  const accordionContext = useAccordionContext()
  const collapsibleContext = useCollapsibleContext()

  let panelRef: HTMLElement | undefined

  createDisclosurePanel({
    element: () => panelRef,
    isExpanded: collapsibleContext.isOpen,
    expand: () =>
      accordionContext.listState().selectionManager().select(itemContext.value)
  })

  // SSR-only initial state; after mount createDisclosurePanel owns the attribute.
  const ssrHidden = untrack(() => !collapsibleContext.isOpen()) || undefined

  return (
    <AccordionContentPrimitive
      class={cn(context.slots?.panel(), local.class)}
      // Kobalte stamps data-expanded as an empty string; HeroUI CSS matches "true"
      aria-hidden={collapsibleContext.isOpen() ? "false" : "true"}
      data-expanded={collapsibleContext.isOpen() ? "true" : undefined}
      data-slot="accordion-panel"
      hidden={ssrHidden}
      ref={mergeRefs((el: HTMLElement) => {
        panelRef = el
      }, local.ref)}
      {...rest}
    />
  )
}

export type {
  AccordionBodyProps,
  AccordionHeadingProps,
  AccordionIndicatorProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionTriggerProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
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
