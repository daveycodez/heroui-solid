import { cn, type LabelVariants, labelVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Label } from "@kobalte/core/text-field"
import { splitProps, useContext, type ValidComponent } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Label Root
 * -----------------------------------------------------------------------------------------------*/
type LabelRootProps<T extends ValidComponent = "label"> = PolymorphicProps<
  T,
  LabelVariants
>

const LabelRoot = <T extends ValidComponent = "label">(
  props: LabelRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as LabelRootProps,
    labelVariants.variantKeys,
    ["class"]
  )
  const formControl = useContext(FormControlContext)

  // Inside a form control, Kobalte's Label wires `for`/id (and only stamps `for`
  // when it actually renders a <label>); standalone it would throw, so render a
  // plain (polymorphic) element — the caller owns the association via `for`.
  return formControl ? (
    <Label
      class={cn(labelVariants(variantProps), local.class)}
      data-slot="label"
      {...rest}
    />
  ) : (
    <Polymorphic
      as="label"
      class={cn(labelVariants(variantProps), local.class)}
      data-slot="label"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { LabelRootProps }
export { LabelRoot }
