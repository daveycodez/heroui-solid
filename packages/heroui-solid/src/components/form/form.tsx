import type { ComponentProps } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Form Root
 * -----------------------------------------------------------------------------------------------*/
// Upstream wraps react-aria-components' Form (native validation propagation via
// React Aria context). The Solid port renders a plain <form>; our fields drive
// their own `isInvalid`, so there is no cross-field validation context to carry.
interface FormRootProps extends ComponentProps<"form"> {}

const FormRoot = (props: FormRootProps) => {
  return <form {...props} />
}

export type { FormRootProps }
export { FormRoot }
