import {
  InputGroupPrefix,
  type InputGroupPrefixProps,
  InputGroupRoot,
  type InputGroupRootProps,
  InputGroupSuffix,
  type InputGroupSuffixProps
} from "./input-group"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
// Like TextField, InputGroup has no `.Input`/`.TextArea`: drop a standalone
// `Input`/`TextArea` inside it and they re-slot themselves via InputGroupContext
// (see input.tsx / textarea.tsx). Only the group-specific parts live here.
export const InputGroup = Object.assign(InputGroupRoot, {
  Prefix: InputGroupPrefix,
  Suffix: InputGroupSuffix
})

export type InputGroup = {
  Props: InputGroupRootProps
  PrefixProps: InputGroupPrefixProps
  SuffixProps: InputGroupSuffixProps
}

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export type { InputGroupVariants } from "@heroui/styles"
export { inputGroupVariants } from "@heroui/styles"
