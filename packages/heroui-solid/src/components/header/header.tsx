import { cn, headerVariants } from "@heroui/styles"
import { type ComponentProps, splitProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Header Root
 * -----------------------------------------------------------------------------------------------*/
interface HeaderRootProps extends ComponentProps<"header"> {}

const HeaderRoot = (props: HeaderRootProps) => {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <header
      class={cn(headerVariants(), local.class)}
      data-slot="header"
      {...rest}
    />
  )
}

export type { HeaderRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { HeaderRoot }
