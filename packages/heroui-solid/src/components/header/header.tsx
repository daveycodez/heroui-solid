import { cn, headerVariants } from "@heroui/styles"
import { type ComponentProps, type JSX, splitProps } from "solid-js"

import { useCollectionDefer } from "../../utils/collection-defer"

/* -------------------------------------------------------------------------------------------------
 * Header Root
 * -----------------------------------------------------------------------------------------------*/
interface HeaderRootProps extends ComponentProps<"header"> {}

const HeaderRoot = (props: HeaderRootProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const render = () => (
    <header
      class={cn(headerVariants(), local.class)}
      data-slot="header"
      {...rest}
    />
  )

  // As a Select section header, defer DOM to the open popover (AGENTS.md).
  return (useCollectionDefer(render) ?? render()) as unknown as JSX.Element
}

export type { HeaderRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { HeaderRoot }
