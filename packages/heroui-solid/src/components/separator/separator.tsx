import { cn, type SeparatorVariants, separatorVariants } from "@heroui/styles"
import { Separator } from "@kobalte/core/separator"
import {
  type ComponentProps,
  type JSX,
  splitProps,
  type ValidComponent
} from "solid-js"

import { useCollectionDefer } from "../../utils/collection-defer"

/* -------------------------------------------------------------------------------------------------
 * Separator Root
 * -----------------------------------------------------------------------------------------------*/
type SeparatorRootProps<T extends ValidComponent = "hr"> = ComponentProps<
  typeof Separator<T>
> &
  SeparatorVariants

const SeparatorRoot = <T extends ValidComponent = "hr">(
  props: SeparatorRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as SeparatorRootProps,
    separatorVariants.variantKeys,
    ["class"]
  )

  // Upstream also inherits orientation from React Aria's slotted
  // SeparatorContext (Toolbar); no Kobalte equivalent until Toolbar is ported.
  const render = () => (
    <Separator
      class={cn(separatorVariants(variantProps), local.class)}
      data-slot="separator"
      orientation={variantProps.orientation}
      {...rest}
    />
  )

  // Between Select sections, defer DOM to the open popover (AGENTS.md).
  return (useCollectionDefer(render) ?? render()) as unknown as JSX.Element
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { SeparatorRootProps }
export { SeparatorRoot }
