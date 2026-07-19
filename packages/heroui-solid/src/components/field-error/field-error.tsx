import { cn, fieldErrorVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { ErrorMessage as FieldErrorPrimitive } from "@kobalte/core/text-field"
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
  typeof FieldErrorPrimitive<T>
>

const FieldErrorRoot = <T extends ValidComponent = "div">(
  props: FieldErrorRootProps<T>
) => {
  const [local, rest] = splitProps(props as FieldErrorRootProps, ["class"])
  const formControl = useContext(FormControlContext)

  // In-field only: Kobalte's ErrorMessage throws standalone, and there's no
  // validation state to key off otherwise. data-visible keys off the invalid
  // state (upstream stamps it unconditionally but only mounts while invalid) so
  // a forceMount'd error stays hidden on valid fields and the CSS reveal runs.
  return formControl ? (
    <FieldErrorPrimitive
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
