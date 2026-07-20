import { type ButtonVariants, buttonVariants, cn } from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import { createMemo, type JSX, splitProps, type ValidComponent } from "solid-js"
import { dataAttr } from "../../utils/assertion"

type ButtonRootProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  ButtonVariants & { isPending?: boolean }
>

const ButtonRoot = <T extends ValidComponent = "button">(
  props: ButtonRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as ButtonRootProps,
    buttonVariants.variantKeys,
    ["isPending", "disabled", "class", "onClick"]
  )

  // Resolve the blocked state in an owned memo at render, not inside the click
  // handler: when this Button is a polymorphic child (e.g. a Dropdown trigger),
  // `local.disabled` chains through Kobalte's memoized `get disabled`, and
  // reading it from the handler — which runs with no reactive owner — would
  // create that memo outside a root ("...will never be disposed"). The memo
  // reads the props under the component owner instead; the handler just reads it.
  const isBlocked = createMemo(() => local.isPending || local.disabled)

  // A pending or disabled button must not activate. Our at-target `on:click`
  // runs ahead of consumer listeners, so stopImmediatePropagation silences
  // them all — covering keyboard activation and polymorphic elements with no
  // native `disabled`.
  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
    if (isBlocked()) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    callHandler(event, local.onClick)
  }

  return (
    <ButtonPrimitive
      class={cn(buttonVariants(variantProps), local.class)}
      data-slot="button"
      // Announces label changes while pending; only stamped when opted in.
      aria-live={"isPending" in local ? "polite" : undefined}
      on:click={handleClick}
      {...rest}
      // After the spread so consumers can't desync state-derived attributes.
      disabled={local.disabled}
      data-pending={dataAttr(local.isPending)}
      aria-disabled={dataAttr(local.isPending)}
    />
  )
}

export type { ButtonRootProps }
export { ButtonRoot }
