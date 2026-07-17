import { type ButtonVariants, buttonVariants, cn } from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import {
  createMemo,
  type JSX,
  mergeProps,
  splitProps,
  type ValidComponent
} from "solid-js"

interface ButtonRootProps extends ButtonVariants {
  isDisabled?: boolean
  isPending?: boolean
  class?: string
  /**
   * Render-prop children must read fields off `state` inside JSX
   * (`state.isPending ? … : …`) — destructuring `({ isPending }) => …`
   * captures a one-time value and loses reactivity.
   */
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

  // Attached via `on:click` (an at-target listener registered at element
  // creation, ahead of any listener consumers add later), so
  // stopImmediatePropagation silences both Solid-delegated handlers and
  // native addEventListener listeners. Pending buttons stay focusable but
  // ignore activation; disabled wins for activation too (covers polymorphic
  // non-button elements where the native `disabled` attribute doesn't apply).
  // Keyboard activation (Enter/Space) synthesizes a native click, so it flows
  // through this same guard.
  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    if (local.isPending || local.isDisabled) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    callHandler(event, local.onClick)
  }

  // One stable state object for the render prop; isPending stays live via
  // the getter.
  const state = {
    get isPending() {
      return !!local.isPending
    }
  }

  // Children resolve exactly once: the memo caches the resolved JSX, so extra
  // reads of `children` (which would otherwise re-clone templates and desync
  // SSR hydration keys — see AGENTS.md) return the same nodes, and toggling
  // isPending never re-invokes the render prop. The memo tracks only the
  // `children` prop itself; `state.isPending` reads inside the returned JSX
  // are lazy and tracked at their insertion points.
  const resolved = createMemo(() => {
    const children = local.children
    return typeof children === "function" ? children(state) : children
  })

  const forwarded = mergeProps(rest, {
    get children(): JSX.Element {
      return resolved()
    }
  })

  return (
    <ButtonPrimitive
      class={cn(buttonVariants(variantProps), local.class)}
      data-slot="button"
      // The button is its own label, so a polite live region on it announces
      // render-prop label changes ("Upload" -> "Uploading...") to screen
      // readers even when the button isn't focused (React Aria's pending
      // pattern). Only stamped when the consumer opted into pending state.
      aria-live={"isPending" in local ? "polite" : undefined}
      on:click={handleClick}
      {...forwarded}
      // Deliberately after the spread: consumers must not desync
      // state-derived attributes from isDisabled/isPending. mergeProps skips
      // undefined, so consumer values still apply while the state is off;
      // data-slot and aria-live above stay overridable.
      disabled={local.isDisabled}
      data-pending={local.isPending ? "true" : undefined}
      aria-disabled={local.isPending ? "true" : undefined}
    />
  )
}

export type { ButtonRootProps }
export { ButtonRoot }
