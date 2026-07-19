import { cn, type TextFieldVariants, textFieldVariants } from "@heroui/styles"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { Root as TextFieldPrimitive } from "@kobalte/core/text-field"
import {
  createContext,
  type JSX,
  splitProps,
  type ValidComponent
} from "solid-js"

/* ------------------------------------------------------------------------------------------------
 * TextField Context
 * --------------------------------------------------------------------------------------------- */
type TextFieldContextValue = {
  variant?: "primary" | "secondary"
}

const TextFieldContext = createContext<TextFieldContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * TextField Root
 * -----------------------------------------------------------------------------------------------*/
interface TextFieldRootProps extends TextFieldVariants {
  /**
   * The variant of the text field.
   * @default "primary"
   */
  variant?: "primary" | "secondary"
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  class?: string
  children?: JSX.Element
}

const TextFieldRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TextFieldRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as TextFieldRootProps,
    textFieldVariants.variantKeys,
    [
      "variant",
      "isDisabled",
      "isReadOnly",
      "isRequired",
      "isInvalid",
      "class",
      "children"
    ]
  )

  return (
    <TextFieldPrimitive
      class={cn(textFieldVariants(variantProps), local.class)}
      data-slot="textfield"
      validationState={local.isInvalid ? "invalid" : undefined}
      disabled={local.isDisabled}
      readOnly={local.isReadOnly}
      required={local.isRequired}
      // HeroUI CSS matches explicit data-*="true" values; Kobalte stamps empty
      // strings, so re-stamp here (rest spreads after Kobalte's dataset).
      data-invalid={local.isInvalid ? "true" : undefined}
      data-required={local.isRequired ? "true" : undefined}
      data-disabled={local.isDisabled ? "true" : undefined}
      data-readonly={local.isReadOnly ? "true" : undefined}
      {...rest}
    >
      <TextFieldContext.Provider
        value={{
          get variant() {
            return local.variant
          }
        }}
      >
        {local.children}
      </TextFieldContext.Provider>
    </TextFieldPrimitive>
  )
}

export type { TextFieldContextValue, TextFieldRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { TextFieldContext, TextFieldRoot }
