import {
  type CloseButtonVariants,
  closeButtonVariants,
  cn
} from "@heroui/styles"
import { Button } from "@kobalte/core/button"
import { callHandler } from "@kobalte/utils"
import {
  type ComponentProps,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { OverlayTriggerContext } from "../../utils/overlay-trigger-context"
import { CloseIcon } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * Close Button Root
 * -----------------------------------------------------------------------------------------------*/
type CloseButtonRootProps<T extends ValidComponent = "button"> = ComponentProps<
  typeof Button<T>
> &
  CloseButtonVariants

const CloseButtonRoot = <T extends ValidComponent = "button">(
  props: CloseButtonRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as CloseButtonRootProps,
    closeButtonVariants.variantKeys,
    ["class", "children", "onClick"]
  )
  // Inside an AlertDialog a close button dismisses it (no-op elsewhere).
  const overlay = useContext(OverlayTriggerContext)

  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    callHandler(
      event,
      local.onClick as
        | JSX.EventHandlerUnion<HTMLElement, MouseEvent>
        | undefined
    )
    if (event.defaultPrevented) {
      return
    }
    overlay.close?.()
  }

  return (
    <Button
      aria-label="Close"
      class={cn(closeButtonVariants(variantProps), local.class)}
      data-slot="close-button"
      on:click={handleClick}
      {...rest}
    >
      {local.children ?? (
        // Decorative inside the labeled button (aria-label="Close"); aria-hidden
        // keeps the shared icon's default label inert (see AGENTS.md, a11y bugs).
        <CloseIcon aria-hidden="true" data-slot="close-button-icon" />
      )}
    </Button>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { CloseButtonRootProps }
export { CloseButtonRoot }
