import { type ButtonVariants, buttonVariants, cn } from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import { Trigger as MenuTriggerPrimitive } from "@kobalte/core/dropdown-menu"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import {
  createMemo,
  type JSX,
  mergeProps,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import {
  createLongPressHandlers,
  MenuTriggerBehaviorContext,
  MenuTriggerContext
} from "../../utils/menu-trigger-context"
import { ButtonGroupContext } from "../button-group"

interface ButtonRootProps extends ButtonVariants {
  isDisabled?: boolean
  isPending?: boolean
  class?: string
  /** Read `state` fields inside JSX — destructuring loses reactivity. */
  children?: JSX.Element | ((state: { isPending: boolean }) => JSX.Element)
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
}

const ButtonRoot = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as ButtonRootProps,
    buttonVariants.variantKeys,
    ["isDisabled", "isPending", "class", "children", "onClick"]
  )

  // As the Dropdown trigger slot with trigger="longPress", the button hosts
  // the long-press interactions (see utils/menu-trigger-context.tsx).
  const isMenuTrigger = useContext(MenuTriggerContext)
  const longPress = createLongPressHandlers(
    isMenuTrigger ? useContext(MenuTriggerBehaviorContext) : undefined
  )

  // Direct props win over the enclosing ButtonGroup's shared values; outside a
  // group the context default is empty, so these fall back to the local props.
  const group = useContext(ButtonGroupContext)
  const groupVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? group.variant
    },
    get size() {
      return variantProps.size ?? group.size
    },
    get fullWidth() {
      return variantProps.fullWidth ?? group.fullWidth
    }
  })

  // At-target `on:click` registers ahead of consumer listeners, so
  // stopImmediatePropagation silences them all while pending/disabled
  // (covers polymorphic elements with no native `disabled`); keyboard
  // activation synthesizes a click and hits the same guard.
  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    longPress.onClick(event)
    if (event.defaultPrevented) {
      return
    }
    if (local.isPending || local.isDisabled) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    callHandler(event, local.onClick)
  }

  // isPending stays live through the getter.
  const state = {
    get isPending() {
      return !!local.isPending
    }
  }

  // Resolve children exactly once (single-read hydration rule — AGENTS.md);
  // the memo tracks only `children`, so isPending toggles never re-invoke
  // the render prop.
  const resolved = createMemo(() => {
    const children = local.children
    return typeof children === "function" ? children(state) : children
  })

  const forwarded = mergeProps(rest, {
    get children(): JSX.Element {
      return resolved()
    }
  })

  // Inside a Dropdown's trigger slot the same button renders Kobalte's menu
  // trigger (see utils/menu-trigger-context.tsx) — upstream parity for
  // <Dropdown><Button>…</Button>….
  const Primitive = isMenuTrigger ? MenuTriggerPrimitive : ButtonPrimitive

  return (
    <Primitive
      class={cn(buttonVariants(groupVariants), local.class)}
      data-slot="button"
      // Announces render-prop label changes while pending (React Aria's
      // pending pattern); only stamped when the consumer opts in.
      aria-live={"isPending" in local ? "polite" : undefined}
      on:click={handleClick}
      on:pointerdown={longPress.onPointerDown}
      on:pointerup={longPress.onPointerUp}
      on:pointerleave={longPress.onPointerLeave}
      on:pointercancel={longPress.onPointerCancel}
      on:keydown={longPress.onKeyDown}
      on:contextmenu={longPress.onContextMenu}
      {...forwarded}
      // After the spread so consumers can't desync state-derived attributes;
      // mergeProps skips undefined, so consumer values apply while off.
      disabled={local.isDisabled ?? group.isDisabled}
      data-pending={local.isPending ? "true" : undefined}
      aria-disabled={local.isPending ? "true" : undefined}
    />
  )
}

export type { ButtonRootProps }
export { ButtonRoot }
