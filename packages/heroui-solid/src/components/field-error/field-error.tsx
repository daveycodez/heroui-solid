import { cn, fieldErrorVariants } from "@heroui/styles"
import { useFormControlContext } from "@kobalte/core"
import { ErrorMessage } from "@kobalte/core/text-field"
import { type ComponentProps, splitProps, type ValidComponent } from "solid-js"

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
  // Pass-through to Kobalte's ErrorMessage (throws outside a field, like the
  // primitive itself). We add only HeroUI's data-visible, keyed off the invalid
  // state so the CSS reveal transition can run.
  const formControl = useFormControlContext()

  return (
    <ErrorMessage
      data-visible={
        formControl.validationState() === "invalid" ? "" : undefined
      }
      class={cn(fieldErrorVariants(), local.class)}
      data-slot="field-error"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { FieldErrorRootProps }
export { FieldErrorRoot }
