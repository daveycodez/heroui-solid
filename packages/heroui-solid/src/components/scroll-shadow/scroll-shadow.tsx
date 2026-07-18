import {
  cn,
  type ScrollShadowVariants,
  scrollShadowVariants
} from "@heroui/styles"
import { mergeRefs } from "@kobalte/utils"
import { type ComponentProps, createMemo, type JSX, splitProps } from "solid-js"

import { createScrollShadow } from "./use-scroll-shadow"

export type ScrollShadowVisibility =
  | "auto"
  | "both"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "none"

export interface ScrollShadowRootProps
  extends Omit<ComponentProps<"div">, "style">,
    ScrollShadowVariants {
  size?: number
  offset?: number
  visibility?: ScrollShadowVisibility
  isEnabled?: boolean
  /**
   * Render the end-edge shadow before scroll measurement (SSR / first frame).
   * Opt in where the content is known to overflow at render time, so the
   * shadow doesn't blink in after hydration; left off, a non-overflowing
   * container never flashes a shadow that vanishes on mount.
   * @default false
   */
  initialShadow?: boolean
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void
  style?: JSX.CSSProperties
}

export const ScrollShadowRoot = (props: ScrollShadowRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    scrollShadowVariants.variantKeys,
    [
      "class",
      "children",
      "ref",
      "style",
      "size",
      "offset",
      "visibility",
      "isEnabled",
      "initialShadow",
      "onVisibilityChange"
    ]
  )

  let internalRef: HTMLDivElement | undefined

  const orientation = () => variantProps.orientation ?? "vertical"
  const size = () => local.size ?? 40
  const visibility = () => local.visibility ?? "auto"

  const shadowAttrs = createScrollShadow({
    assumeOverflow: () => local.initialShadow ?? false,
    containerRef: () => internalRef,
    isEnabled: () => local.isEnabled ?? true,
    offset: () => local.offset ?? 0,
    onVisibilityChange: local.onVisibilityChange,
    orientation,
    visibility
  })

  const slots = createMemo(() => scrollShadowVariants(variantProps))

  return (
    <div
      class={cn(slots().base(), local.class)}
      data-orientation={orientation()}
      data-scroll-shadow-size={size()}
      data-slot="scroll-shadow"
      ref={mergeRefs((el: HTMLDivElement) => {
        internalRef = el
      }, local.ref)}
      style={{ "--scroll-shadow-size": `${size()}px`, ...local.style }}
      {...rest}
      {...shadowAttrs()}
    >
      {local.children}
    </div>
  )
}

ScrollShadowRoot.displayName = "HeroUI.ScrollShadow"
