import { cn, errorMessageVariants } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { splitProps, type ValidComponent } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Error Message Root
 * -----------------------------------------------------------------------------------------------*/
type ErrorMessageRootProps<T extends ValidComponent = "span"> =
  PolymorphicProps<T>

const ErrorMessageRoot = <T extends ValidComponent = "span">(
  props: ErrorMessageRootProps<T>
) => {
  const [local, rest] = splitProps(props as ErrorMessageRootProps, ["class"])

  return (
    <Polymorphic
      as="span"
      class={cn(errorMessageVariants(), local.class)}
      data-slot="error-message"
      slot="errorMessage"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { ErrorMessageRootProps }
export { ErrorMessageRoot }
