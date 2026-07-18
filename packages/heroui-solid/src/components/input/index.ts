import type { ComponentProps } from "solid-js"

import { InputRoot } from "./input"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Input = Object.assign(InputRoot, {
  Root: InputRoot
})

export type Input = {
  Props: ComponentProps<typeof InputRoot>
  RootProps: ComponentProps<typeof InputRoot>
}

export type { InputVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { inputVariants } from "@heroui/styles"
export type { InputRootProps, InputRootProps as InputProps } from "./input"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export { InputRoot }
