import { cn, type LabelVariants, labelVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Label } from "@kobalte/core/text-field"
import { type ComponentProps, splitProps, useContext } from "solid-js"

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
  const formControl = useContext(FormControlContext)

  return formControl ? (
    <Label
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
export { LabelRoot }
