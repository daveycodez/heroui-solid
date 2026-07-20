import {
  type CloseButtonVariants,
  closeButtonVariants,
  cn
} from "@heroui/styles"
import { Root as ButtonPrimitive } from "@kobalte/core/button"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, type ValidComponent } from "solid-js"

import { CloseIcon } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * Close Button Root
 * -----------------------------------------------------------------------------------------------*/
type CloseButtonRootProps<T extends ValidComponent = "button"> =
  PolymorphicProps<T, CloseButtonVariants>

const CloseButtonRoot = <T extends ValidComponent = "button">(
  props: CloseButtonRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as CloseButtonRootProps,
    closeButtonVariants.variantKeys,
    ["class", "children"]
  )

  return (
    <ButtonPrimitive
      aria-label="Close"
      class={cn(closeButtonVariants(variantProps), local.class)}
      data-slot="close-button"
      type="button"
      {...rest}
    >
      {/* Default icon is decorative — the button already carries aria-label. */}
      {local.children ?? (
        <CloseIcon aria-hidden="true" data-slot="close-button-icon" />
      )}
    </ButtonPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { CloseButtonRootProps }
export { CloseButtonRoot }
