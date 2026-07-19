import type { ComponentProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Form Root
 * -----------------------------------------------------------------------------------------------*/
// Upstream is a thin wrapper over react-aria-components' Form, whose value is a
// FormValidationContext (the `validationErrors` map — server errors propagate to
// descendant fields by name) plus a validationBehavior default. Kobalte has no
// Form primitive and our fields self-validate, so we render a plain <form> and
// don't port that RAC layer (see the Form docs' Validation section).
interface FormRootProps extends ComponentProps<"form"> {}

const FormRoot = (props: FormRootProps) => {
  return <form {...props} />
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { FormRootProps }
export { FormRoot }
