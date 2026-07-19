import {
  cn,
  type DescriptionVariants,
  descriptionVariants
} from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Description as DescriptionPrimitive } from "@kobalte/core/text-field"
import { type ComponentProps, splitProps, useContext } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Description Root
 * -----------------------------------------------------------------------------------------------*/
interface DescriptionRootProps
  extends ComponentProps<"div">,
    DescriptionVariants {}

const DescriptionRoot = (props: DescriptionRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    descriptionVariants.variantKeys,
    ["class"]
  )
  const formControl = useContext(FormControlContext)

  return formControl ? (
    <DescriptionPrimitive
      class={cn(descriptionVariants(variantProps), local.class)}
      data-slot="description"
      {...rest}
    />
  ) : (
    <div
      class={cn(descriptionVariants(variantProps), local.class)}
      data-slot="description"
      {...rest}
    />
  )
}

export type { DescriptionRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { DescriptionRoot }
