import { cn, type LabelVariants, labelVariants } from "@heroui/styles"
import { Label as LabelPrimitive } from "@kobalte/core/text-field"
import { type ComponentProps, splitProps, useContext } from "solid-js"

import { FieldContext } from "../../utils/field-context"

/* -------------------------------------------------------------------------------------------------
 * Label Root
 * -----------------------------------------------------------------------------------------------*/
interface LabelRootProps extends ComponentProps<"label">, LabelVariants {}

const LabelRoot = (props: LabelRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    labelVariants.variantKeys,
    ["class"]
  )
  const field = useContext(FieldContext)

  return field ? (
    <LabelPrimitive
      class={cn(labelVariants(variantProps), local.class)}
      data-slot="label"
      {...rest}
    />
  ) : (
    // biome-ignore lint/a11y/noLabelWithoutControl: association is supplied by the caller via `for`
    <label
      class={cn(labelVariants(variantProps), local.class)}
      data-slot="label"
      {...rest}
    />
  )
}

export type { LabelRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { LabelRoot }
