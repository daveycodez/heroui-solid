import {
  TooltipArrow,
  type TooltipArrowProps,
  TooltipContent,
  type TooltipContentProps,
  TooltipPortal,
  type TooltipPortalProps,
  TooltipRoot,
  type TooltipRootProps,
  TooltipTrigger,
  type TooltipTriggerProps
} from "./tooltip"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow
})

export type Tooltip = {
  Props: TooltipRootProps
  TriggerProps: TooltipTriggerProps
  PortalProps: TooltipPortalProps
  ContentProps: TooltipContentProps
  ArrowProps: TooltipArrowProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
// Tooltip has no variants (slots-only: base + trigger); only the styling fn is
// re-exported (no TooltipVariants type).
export { tooltipVariants } from "@heroui/styles"
