import {
  type ButtonGroupVariants,
  buttonGroupVariants,
  cn
} from "@heroui/styles"
import { createContext, type JSX, splitProps, useContext } from "solid-js"
import { dataAttr } from "../../utils/assertion"

import type { ButtonRootProps } from "../button/button"

/* -------------------------------------------------------------------------------------------------
 * ButtonGroup Context
 * -----------------------------------------------------------------------------------------------*/
type ButtonGroupContextValue = {
  slots?: ReturnType<typeof buttonGroupVariants>
  size?: ButtonRootProps["size"]
  variant?: ButtonRootProps["variant"]
  isDisabled?: boolean
  fullWidth?: boolean
}

// Solid context flows to every descendant, so — unlike upstream's
// BUTTON_GROUP_CHILD marker (React clones direct children to tag them) — a
// Button nested arbitrarily deep also inherits the group's values. All real
// usage places Buttons as direct children, where the behavior is identical.
const ButtonGroupContext = createContext<ButtonGroupContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * ButtonGroup Root
 * -----------------------------------------------------------------------------------------------*/
interface ButtonGroupRootProps extends ButtonGroupVariants {
  size?: ButtonRootProps["size"]
  variant?: ButtonRootProps["variant"]
  isDisabled?: boolean
  class?: string
  children?: JSX.Element
}

const ButtonGroupRoot = (props: ButtonGroupRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    buttonGroupVariants.variantKeys,
    ["size", "variant", "isDisabled", "class", "children"]
  )

  const slots = () => buttonGroupVariants(variantProps)

  const context: ButtonGroupContextValue = {
    get slots() {
      return slots()
    },
    get size() {
      return local.size
    },
    get variant() {
      return local.variant
    },
    get isDisabled() {
      return local.isDisabled
    },
    get fullWidth() {
      return variantProps.fullWidth
    }
  }

  return (
    <ButtonGroupContext.Provider value={context}>
      {/* biome-ignore lint/a11y/useSemanticElements: mirrors upstream's React Aria Group (a div with role="group"); fieldset has divergent flex layout */}
      <div
        role="group"
        class={cn(slots().base(), local.class)}
        data-slot="button-group"
        aria-disabled={dataAttr(local.isDisabled)}
        {...rest}
      >
        {local.children}
      </div>
    </ButtonGroupContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ButtonGroup Separator
 * -----------------------------------------------------------------------------------------------*/
interface ButtonGroupSeparatorProps {
  class?: string
  children?: JSX.Element
}

const ButtonGroupSeparator = (props: ButtonGroupSeparatorProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useContext(ButtonGroupContext)

  return (
    <span
      aria-hidden="true"
      class={cn(context.slots?.separator(), local.class)}
      data-slot="button-group-separator"
      {...rest}
    />
  )
}

export type { ButtonGroupRootProps, ButtonGroupSeparatorProps }
export { ButtonGroupContext, ButtonGroupRoot, ButtonGroupSeparator }
