import { cn, tooltipVariants } from "@heroui/styles"
import { usePopperContext } from "@kobalte/core/popper"
import { Tooltip, useTooltipContext } from "@kobalte/core/tooltip"
import {
  type ComponentProps,
  createContext,
  createMemo,
  createSignal,
  mergeProps,
  onMount,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"
import { parseCSSTime } from "../../utils/css"

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
  const [local, rest] = splitProps(props, ["openDelay", "closeDelay"])

  // Global delay config: default open/close delays come from the
  // `--tooltip-delay`/`--tooltip-close-delay` CSS variables (the @heroui/styles
  // theme ships 1500ms/500ms). Kobalte's delay is a JS timer, not a CSS one, so
  // the variable is read here and fed to `openDelay`/`closeDelay`; an explicit
  // prop wins over the variable.
  const [cssOpenDelay, setCssOpenDelay] = createSignal<number>()
  const [cssCloseDelay, setCssCloseDelay] = createSignal<number>()

  onMount(() => {
    const styles = getComputedStyle(document.documentElement)
    setCssOpenDelay(parseCSSTime(styles.getPropertyValue("--tooltip-delay")))
    setCssCloseDelay(
      parseCSSTime(styles.getPropertyValue("--tooltip-close-delay"))
    )
  })

  const merged = mergeProps(
    { gutter: 3, placement: "top" } satisfies TooltipRootProps,
    rest,
    {
      get openDelay() {
        return local.openDelay ?? cssOpenDelay()
      },
      get closeDelay() {
        return local.closeDelay ?? cssCloseDelay()
      }
    }
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
type TooltipArrowProps = { size?: number }

const TooltipArrow = (props: TooltipArrowProps) => {
  const popper = usePopperContext()

  // HeroUI's exact arrow (12x12) — Kobalte's own arrow is a different, wider
  // shape and can't be reshaped via `size`. We render our own svg and hand it
  // to Kobalte's popper for positioning; @heroui/styles' `[data-slot=overlay-arrow]`
  // CSS paints and rotates it per placement.
  // CAUTION: this couples to `usePopperContext().setArrowRef` (Kobalte flags it
  // "API will most probably change") and to Kobalte assigning `left/top/[dir]`
  // inline styles on this element — re-verify arrow positioning after any
  // @kobalte/core bump. See AGENTS.md (arrowed overlays).
  return (
    <svg
      ref={popper.setArrowRef as unknown as (el: SVGSVGElement) => void}
      aria-hidden="true"
      data-slot="overlay-arrow"
      fill="none"
      height={props.size ?? 12}
      width={props.size ?? 12}
      viewBox="0 0 12 12"
      style={{ position: "absolute" }}
    >
      <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
    </svg>
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
