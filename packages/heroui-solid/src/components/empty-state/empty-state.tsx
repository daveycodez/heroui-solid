import { cn, emptyStateVariants } from "@heroui/styles"
import { type ComponentProps, splitProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * EmptyState Root
 * -----------------------------------------------------------------------------------------------*/
interface EmptyStateRootProps extends ComponentProps<"div"> {}

const EmptyStateRoot = (props: EmptyStateRootProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])

  return (
    <div
      class={cn(emptyStateVariants(), local.class)}
      data-slot="empty-state"
      {...rest}
    >
      {local.children ?? "No results found"}
    </div>
  )
}

export type { EmptyStateRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { EmptyStateRoot }
