import { cn, fieldErrorVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { ErrorMessage } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Field Error Root
 * -----------------------------------------------------------------------------------------------*/
type FieldErrorRootProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof ErrorMessage<T>
>

const FieldErrorRoot = <T extends ValidComponent = "div">(
  props: FieldErrorRootProps<T>
) => {
  const [local, rest] = splitProps(props as FieldErrorRootProps, ["class"])
  const formControl = useContext(FormControlContext)

  // Renders only inside a field — matching upstream, whose RAC FieldError does
  // `if (!validation?.isInvalid) return null` (no context ⇒ null; it does not
  // throw). data-visible keys off the invalid state (upstream stamps it
  // unconditionally but only mounts while invalid) so a forceMount'd error stays
  // hidden on valid fields and the CSS reveal transition can run.
  return formControl ? (
    <ErrorMessage
      data-visible={
        formControl.validationState() === "invalid" ? "" : undefined
      }
      class={cn(fieldErrorVariants(), local.class)}
      data-slot="field-error"
      {...rest}
    />
  ) : null
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { FieldErrorRootProps }
export { FieldErrorRoot }
