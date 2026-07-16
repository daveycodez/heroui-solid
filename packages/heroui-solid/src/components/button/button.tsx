import clsx from "clsx"
import { type JSX, splitProps } from "solid-js"
import { type ButtonVariantProps, buttonStyles } from "./button.styles"

export interface ButtonRenderProps {
  /** Whether the button is currently in its pending (loading) state. */
  isPending: boolean
}

export interface ButtonProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    ButtonVariantProps {
  /** Whether the button is disabled. @default false */
  isDisabled?: boolean
  /**
   * Whether the button is in a pending state (e.g. while an async action
   * runs). A pending button stays focusable but ignores activation, mirroring
   * HeroUI/React Aria semantics. @default false
   */
  isPending?: boolean
  /** Content, or a render function receiving `{ isPending }` to swap in a Spinner. */
  children?: JSX.Element | ((state: ButtonRenderProps) => JSX.Element)
}

/**
 * HeroUI-styled native `<button>`.
 */
export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
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

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
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

  // Read the children getter exactly once per evaluation. Children props are
  // create-on-access getters, and a bare `typeof local.children` ternary in
  // JSX compiles into TWO accesses (a typeof memo + the render branch) —
  // children get created twice, consuming SSR hydration keys asymmetrically
  // and desyncing hydration for element children (e.g. icons).
  const renderChildren = () => {
    const children = local.children
    return typeof children === "function" ? children(state) : children
  }

  return (
    <button
      type="button"
      data-slot="button"
      class={clsx(buttonStyles(local), local.class)}
      disabled={local.isDisabled}
      data-pending={local.isPending ? "true" : undefined}
      aria-disabled={local.isPending ? "true" : undefined}
      onClick={handleClick}
      {...rest}
    >
      {renderChildren()}
    </button>
  )
}
