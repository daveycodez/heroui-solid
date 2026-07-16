import { cn, type FieldErrorVariants, fieldErrorVariants } from "@heroui/styles"
import { ErrorMessage as FieldErrorPrimitive } from "@kobalte/core/text-field"
import { type ComponentProps, splitProps, useContext } from "solid-js"

import { FieldContext } from "../../utils/field-context"

/* -------------------------------------------------------------------------------------------------
 * Field Error Root
 * -----------------------------------------------------------------------------------------------*/
interface FieldErrorRootProps
  extends ComponentProps<"div">,
    FieldErrorVariants {
  forceMount?: boolean
}

const FieldErrorRoot = (props: FieldErrorRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    fieldErrorVariants.variantKeys,
    ["class"]
  )
  const field = useContext(FieldContext)

  // Outside a field there is no validation state to key off, mirroring
  // upstream, where FieldError renders nothing without a field context.
  return field ? (
    <FieldErrorPrimitive
      data-visible=""
      class={cn(fieldErrorVariants(variantProps), local.class)}
      data-slot="field-error"
      {...rest}
    />
  ) : null
}

export type { FieldErrorRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { FieldErrorRoot }
