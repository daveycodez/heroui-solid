import {
  type CloseButtonVariants,
  closeButtonVariants,
  cn
} from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import {
  type ComponentProps,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { OverlayTriggerContext } from "../../utils/overlay-trigger-context"

/* -------------------------------------------------------------------------------------------------
 * Close Icon
 * -----------------------------------------------------------------------------------------------*/
// Upstream stamps aria-label on this aria-hidden svg (an a11y defect — a name
// on an element removed from the accessibility tree); dropped here, keeping
// aria-hidden + role="presentation" (see AGENTS.md, ExternalLinkIcon).
const CloseIcon = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={16}
    role="presentation"
    viewBox="0 0 16 16"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clip-rule="evenodd"
      d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

/* -------------------------------------------------------------------------------------------------
 * Close Button Root
 * -----------------------------------------------------------------------------------------------*/
interface CloseButtonRootProps extends CloseButtonVariants {
  class?: string
  children?: JSX.Element
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

const CloseButtonRoot = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, CloseButtonRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as CloseButtonRootProps,
    closeButtonVariants.variantKeys,
    ["class", "children", "onClick"]
  )
  // Inside an AlertDialog a close button dismisses it (no-op elsewhere).
  const overlay = useContext(OverlayTriggerContext)

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
    callHandler(event, local.onClick)
    if (event.defaultPrevented) {
      return
    }
    overlay.close?.()
  }

  return (
    <ButtonPrimitive
      aria-label="Close"
      class={cn(closeButtonVariants(variantProps), local.class)}
      data-slot="close-button"
      on:click={handleClick}
      {...rest}
    >
      {local.children ?? <CloseIcon data-slot="close-button-icon" />}
    </ButtonPrimitive>
  )
}

export type { CloseButtonRootProps }
export { CloseButtonRoot }
