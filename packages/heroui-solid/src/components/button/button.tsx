import { Root as ButtonPrimitive } from "@kobalte/core/button"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import clsx from "clsx"
import { type JSX, splitProps, type ValidComponent } from "solid-js"
import { type ButtonVariantProps, buttonStyles } from "./button.styles"

export interface ButtonRenderProps {
  /** Whether the button is currently in its pending (loading) state. */
  isPending: boolean
}

export interface ButtonProps extends ButtonVariantProps {
  /** Whether the button is disabled. @default false */
  isDisabled?: boolean
  /**
   * Whether the button is in a pending state (e.g. while an async action
   * runs). A pending button stays focusable but ignores activation, mirroring
   * HeroUI/React Aria semantics. @default false
   */
  isPending?: boolean
  class?: string
  /** Content, or a render function receiving `{ isPending }` to swap in a Spinner. */
  children?: JSX.Element | ((state: ButtonRenderProps) => JSX.Element)
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
}

/**
 * HeroUI-styled button on top of `@kobalte/core/button`.
 * Polymorphic via `as` (e.g. `<Button as="a" href="…">` for link-buttons).
 */
export function Button<T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ButtonProps>
) {
  const [local, rest] = splitProps(props as ButtonProps, [
    "variant",
    "size",
    "fullWidth",
    "isIconOnly",
    "isDisabled",
    "isPending",
    "class",
    "children",
    "onClick"
  ])

  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    if (local.isPending) {
      // Pending buttons stay focusable but ignore activation.
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    const onClick = local.onClick
    if (typeof onClick === "function") onClick(event)
    else if (onClick) onClick[0](onClick[1], event)
  }

  const state: ButtonRenderProps = {
    get isPending() {
      return !!local.isPending
    }
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      class={clsx(buttonStyles(local), local.class)}
      disabled={local.isDisabled}
      data-pending={local.isPending ? "true" : undefined}
      aria-disabled={local.isPending ? "true" : undefined}
      onClick={handleClick}
      {...rest}
    >
      {typeof local.children === "function"
        ? local.children(state)
        : local.children}
    </ButtonPrimitive>
  )
}
