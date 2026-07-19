import { cn, tooltipVariants } from "@heroui/styles"
import { usePopperContext } from "@kobalte/core/popper"
import { Tooltip, useTooltipContext } from "@kobalte/core/tooltip"
import {
  type ComponentProps,
  createContext,
  createMemo,
  mergeProps,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"

/* -------------------------------------------------------------------------------------------------
 * Tooltip Context
 * -----------------------------------------------------------------------------------------------*/
type TooltipContextValue = {
  slots?: ReturnType<typeof tooltipVariants>
}

const TooltipContext = createContext<TooltipContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Tooltip Root
 * -----------------------------------------------------------------------------------------------*/
type TooltipRootProps = ComponentProps<typeof Tooltip>

const TooltipRoot = (props: TooltipRootProps) => {
  const merged = mergeProps(
    { placement: "top" } satisfies TooltipRootProps,
    props
  )

  const slots = createMemo(() => tooltipVariants())

  return (
    <TooltipContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <Tooltip {...merged} />
    </TooltipContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip Trigger
 * -----------------------------------------------------------------------------------------------*/
type TooltipTriggerProps<T extends ValidComponent = "button"> = ComponentProps<
  typeof Tooltip.Trigger<T>
>

const TooltipTrigger = <T extends ValidComponent = "button">(
  props: TooltipTriggerProps<T>
) => {
  const [local, rest] = splitProps(props as TooltipTriggerProps, ["class"])
  const context = useContext(TooltipContext)

  return (
    <Tooltip.Trigger
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="tooltip-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip Portal
 * -----------------------------------------------------------------------------------------------*/
type TooltipPortalProps = ComponentProps<typeof Tooltip.Portal>

const TooltipPortal = (props: TooltipPortalProps) => {
  return <Tooltip.Portal {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip Content
 * -----------------------------------------------------------------------------------------------*/
type TooltipContentProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof Tooltip.Content<T>
>

const TooltipContent = <T extends ValidComponent = "div">(
  props: TooltipContentProps<T>
) => {
  const [local, rest] = splitProps(props as TooltipContentProps, ["class"])
  const context = useContext(TooltipContext)
  const tooltip = useTooltipContext()
  const popper = usePopperContext()

  // Bridge Kobalte's open/present lifecycle + placement to the RAC data
  // attributes @heroui/styles' tooltip animations key off, so upstream's
  // entering/exiting/placement CSS applies verbatim.
  return (
    <Tooltip.Content
      class={cn(context.slots?.base(), local.class)}
      data-slot="tooltip"
      data-placement={popper.currentPlacement().split("-")[0]}
      data-entering={dataAttr(tooltip.isOpen())}
      data-exiting={dataAttr(tooltip.contentPresent() && !tooltip.isOpen())}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tooltip Arrow
 * -----------------------------------------------------------------------------------------------*/
type TooltipArrowProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof Tooltip.Arrow<T>
>

const TooltipArrow = <T extends ValidComponent = "div">(
  props: TooltipArrowProps<T>
) => {
  const [local, rest] = splitProps(props as TooltipArrowProps, ["class"])

  return (
    <Tooltip.Arrow class={local.class} data-slot="tooltip-arrow" {...rest} />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipRootProps,
  TooltipTriggerProps
}

export {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger
}
