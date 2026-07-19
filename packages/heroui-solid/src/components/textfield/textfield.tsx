import { cn, type TextFieldVariants, textFieldVariants } from "@heroui/styles"
import { TextField } from "@kobalte/core/text-field"
import {
  type ComponentProps,
  createContext,
  splitProps,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"

/* -------------------------------------------------------------------------------------------------
 * TextField Context
 * -----------------------------------------------------------------------------------------------*/
type TextFieldContextValue = {
  variant?: "primary" | "secondary"
}

const TextFieldContext = createContext<TextFieldContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * TextField Root
 * -----------------------------------------------------------------------------------------------*/
type TextFieldRootProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof TextField<T>
> &
  TextFieldVariants & {
    /**
     * The variant of the text field.
     * @default "primary"
     */
    variant?: "primary" | "secondary"
  }

const TextFieldRoot = <T extends ValidComponent = "div">(
  props: TextFieldRootProps<T>
) => {
  const p = props as TextFieldRootProps
  const [variantProps, local, rest] = splitProps(
    p,
    textFieldVariants.variantKeys,
    ["class", "variant", "children"]
  )

  return (
    <TextField
      class={cn(textFieldVariants(variantProps), local.class)}
      data-slot="textfield"
      // HeroUI CSS matches explicit data-*="true" values while Kobalte stamps
      // empty strings; Kobalte spreads leftover props after its own dataset, so
      // these re-stamps win. Descendant-level attrs bridge in overrides CSS.
      data-invalid={dataAttr(p.validationState === "invalid")}
      data-required={p.required}
      data-disabled={p.disabled}
      data-readonly={p.readOnly}
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
    </TextField>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { TextFieldContextValue, TextFieldRootProps }
export { TextFieldContext, TextFieldRoot }
