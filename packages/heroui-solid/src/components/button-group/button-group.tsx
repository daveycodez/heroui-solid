import {
  type ButtonGroupVariants,
  buttonGroupVariants,
  cn
} from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  type Accessor,
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"
import type { ButtonRootProps } from "../button/button"

/* -------------------------------------------------------------------------------------------------
 * ButtonGroup Context
 * -----------------------------------------------------------------------------------------------*/
type ButtonGroupContextValue = {
  slots?: Accessor<ReturnType<typeof buttonGroupVariants>>
  size?: Accessor<ButtonRootProps["size"]>
  variant?: Accessor<ButtonRootProps["variant"]>
  disabled?: Accessor<ButtonRootProps["disabled"]>
  fullWidth?: Accessor<ButtonRootProps["fullWidth"]>
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * ButtonGroup Root
 * -----------------------------------------------------------------------------------------------*/
interface ButtonGroupRootProps
  extends ComponentProps<"div">,
    ButtonGroupVariants,
    Pick<ButtonRootProps, "size" | "variant" | "disabled"> {}

const ButtonGroupRoot = (props: ButtonGroupRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    buttonGroupVariants.variantKeys,
    ["class", "size", "variant", "disabled"]
  )

  const slots = createMemo(() => buttonGroupVariants(variantProps))

  return (
    <ButtonGroupContext.Provider
      value={{
        slots,
        size: () => local.size,
        variant: () => local.variant,
        fullWidth: () => variantProps.fullWidth,
        disabled: () => local.disabled
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: role="group" mirrors React Aria's Group — a button wrapper, not a semantic <fieldset>. */}
      <div
        role="group"
        class={cn(slots().base(), local.class)}
        data-slot="button-group"
        data-disabled={dataAttr(local.disabled)}
        {...rest}
      />
    </ButtonGroupContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ButtonGroup Separator
 * -----------------------------------------------------------------------------------------------*/
type ButtonGroupSeparatorProps<T extends ValidComponent = "span"> =
  PolymorphicProps<T>

const ButtonGroupSeparator = <T extends ValidComponent = "span">(
  props: ButtonGroupSeparatorProps<T>
) => {
  const [local, rest] = splitProps(props as ButtonGroupSeparatorProps, [
    "class"
  ])

  const context = useContext(ButtonGroupContext)

  return (
    <Polymorphic
      as="span"
      aria-hidden="true"
      class={cn(context.slots?.()?.separator(), local.class)}
      data-slot="button-group-separator"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type {
  ButtonGroupContextValue,
  ButtonGroupRootProps,
  ButtonGroupSeparatorProps
}

export { ButtonGroupContext, ButtonGroupRoot, ButtonGroupSeparator }
