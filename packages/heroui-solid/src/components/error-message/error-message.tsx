import { cn, errorMessageVariants } from "@heroui/styles"
import { type ComponentProps, splitProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Error Message Root
 * -----------------------------------------------------------------------------------------------*/
interface ErrorMessageRootProps extends ComponentProps<"span"> {}

const ErrorMessageRoot = (props: ErrorMessageRootProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])

  return (
    <span
      class={cn(errorMessageVariants(), local.class)}
      data-slot="error-message"
      slot="errorMessage"
      {...rest}
    >
      {local.children}
    </span>
  )
}

export type { ErrorMessageRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { ErrorMessageRoot }
