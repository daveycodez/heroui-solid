import { cn, type FieldErrorVariants, fieldErrorVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { ErrorMessage as FieldErrorPrimitive } from "@kobalte/core/text-field"
import { type ComponentProps, splitProps, useContext } from "solid-js"

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
  const formControl = useContext(FormControlContext)

  // Outside a field there is no validation state to key off, mirroring
  // upstream, where FieldError renders nothing without a field context.
  // data-visible keys off the invalid state (upstream stamps it
  // unconditionally, but only mounts while invalid) so forceMount stays
  // hidden on valid fields and the CSS reveal transition can run.
  return formControl ? (
    <FieldErrorPrimitive
      data-visible={
        formControl?.validationState() === "invalid" ? "" : undefined
      }
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
