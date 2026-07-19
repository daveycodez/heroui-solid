import { cn, descriptionVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Description as DescriptionPrimitive } from "@kobalte/core/text-field"
import { splitProps, useContext, type ValidComponent } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Description Root
 * -----------------------------------------------------------------------------------------------*/
type DescriptionRootProps<T extends ValidComponent = "div"> =
  PolymorphicProps<T>

const DescriptionRoot = <T extends ValidComponent = "div">(
  props: DescriptionRootProps<T>
) => {
  const [local, rest] = splitProps(props as DescriptionRootProps, ["class"])
  const formControl = useContext(FormControlContext)

  // Inside a form control, Kobalte's Description wires the aria-describedby id;
  // standalone it would throw, so render a plain (polymorphic) element instead.
  return formControl ? (
    <DescriptionPrimitive
      class={cn(descriptionVariants(), local.class)}
      data-slot="description"
      {...rest}
    />
  ) : (
    <Polymorphic
      as="div"
      class={cn(descriptionVariants(), local.class)}
      data-slot="description"
      {...rest}
    />
  )
}

export type { DescriptionRootProps }
export { DescriptionRoot }
