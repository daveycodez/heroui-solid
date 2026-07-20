import { type ButtonVariants, buttonVariants, cn } from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
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
import { dataAttr } from "../../utils/assertion"
import { ButtonGroupContext } from "../button-group/button-group"

type ButtonRootProps<T extends ValidComponent = "button"> = PolymorphicProps<
  T,
  ButtonVariants & { isPending?: boolean }
>

const ButtonRoot = <T extends ValidComponent = "button">(
  props: ButtonRootProps<T>
) => {
  const buttonGroup = useContext(ButtonGroupContext)

  const buttonGroupProps = () => ({
    variant: buttonGroup.variant?.(),
    size: buttonGroup.size?.(),
    fullWidth: buttonGroup.fullWidth?.(),
    disabled: buttonGroup.disabled?.()
  })

  const merged = mergeProps(buttonGroupProps, props as ButtonRootProps)

  // `disabled` stays in `rest` so it spreads onto the button as-is (already
  // resolved against the group by mergeProps above); only the keys we need to
  // read or transform are peeled off.
  const [variantProps, local, rest] = splitProps(
    merged,
    buttonVariants.variantKeys,
    ["isPending", "class", "onClick"]
  )

  // Resolve the blocked state in an owned memo at render, not inside the click
  // handler: when this Button is a polymorphic child (e.g. a Dropdown trigger),
  // `merged.disabled` chains through Kobalte's memoized `get disabled`, and
  // reading it from the handler — which runs with no reactive owner — would
  // create that memo outside a root ("...will never be disposed"). The memo
  // reads the props under the component owner instead; the handler just reads it.
  const isBlocked = createMemo(() => local.isPending || merged.disabled)

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
      data-pending={dataAttr(local.isPending)}
      aria-disabled={dataAttr(local.isPending)}
    />
  )
}

export type { ButtonRootProps }
export { ButtonRoot }
