import { cn, emptyStateVariants } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, type ValidComponent } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * EmptyState Root
 * -----------------------------------------------------------------------------------------------*/
type EmptyStateRootProps<T extends ValidComponent = "div"> = PolymorphicProps<T>

const EmptyStateRoot = <T extends ValidComponent = "div">(
  props: EmptyStateRootProps<T>
) => {
  const [local, rest] = splitProps(props as EmptyStateRootProps, [
    "class",
    "children"
  ])

  return (
    <Polymorphic
      as="div"
      class={cn(emptyStateVariants(), local.class)}
      data-slot="empty-state"
      {...rest}
    >
      {local.children || "No results found"}
    </Polymorphic>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { EmptyStateRootProps }
export { EmptyStateRoot }
