import { cn, type SeparatorVariants, separatorVariants } from "@heroui/styles"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Root as SeparatorPrimitive } from "@kobalte/core/separator"
import { type JSX, splitProps, type ValidComponent } from "solid-js"

import { useCollectionDefer } from "../../utils/collection-defer"

/* -------------------------------------------------------------------------------------------------
 * Separator Root
 * -----------------------------------------------------------------------------------------------*/
interface SeparatorRootProps extends SeparatorVariants {
  class?: string
}

const SeparatorRoot = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, SeparatorRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as SeparatorRootProps,
    separatorVariants.variantKeys,
    ["class"]
  )

  // Upstream also inherits orientation from React Aria's slotted
  // SeparatorContext (Toolbar); no Kobalte equivalent until Toolbar is ported.
  const render = () => (
    <SeparatorPrimitive
      class={cn(separatorVariants(variantProps), local.class)}
      data-slot="separator"
      orientation={variantProps.orientation}
      {...rest}
    />
  )

  // Between Select sections, defer DOM to the open popover (AGENTS.md).
  return (useCollectionDefer(render) ?? render()) as unknown as JSX.Element
}

export type { SeparatorRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { SeparatorRoot }
