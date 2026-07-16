import { type ButtonVariants, buttonVariants, cn } from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import { type JSX, mergeProps, splitProps, type ValidComponent } from "solid-js"

interface ButtonRootProps extends ButtonVariants {
  isDisabled?: boolean
  isPending?: boolean
  class?: string
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

  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    // Pending buttons stay focusable but ignore activation.
    if (local.isPending) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    callHandler(event, local.onClick)
  }

  // Children must be read exactly once per evaluation — a second read creates
  // them twice and desyncs SSR hydration keys (see AGENTS.md).
  const forwarded = mergeProps(rest, {
    get children(): JSX.Element {
      const children = local.children
      return typeof children === "function"
        ? children({
            get isPending() {
              return !!local.isPending
            }
          })
        : children
    }
  })

  return (
    <ButtonPrimitive
      class={cn(buttonVariants(variantProps), local.class)}
      data-slot="button"
      disabled={local.isDisabled}
      data-pending={local.isPending ? "true" : undefined}
      aria-disabled={local.isPending ? "true" : undefined}
      onClick={handleClick}
      {...forwarded}
    />
  )
}

export type { ButtonRootProps }
export { ButtonRoot }
