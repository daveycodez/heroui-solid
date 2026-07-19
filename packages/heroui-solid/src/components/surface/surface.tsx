import { cn, type SurfaceVariants, surfaceVariants } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  type JSX,
  splitProps,
  type ValidComponent
} from "solid-js"

/* ------------------------------------------------------------------------------------------------
 * Surface Context
 * --------------------------------------------------------------------------------------------- */
// Cross-component "on a surface" signal: Card reads it for contrast; overlays
// (Dropdown, Select, Combo-box, Autocomplete) and Alert provide it for their
// content. Mirrors upstream's SurfaceContext.
type SurfaceContextValue = {
  variant?: SurfaceVariants["variant"]
}

const SurfaceContext = createContext<SurfaceContextValue>({})

/* ------------------------------------------------------------------------------------------------
 * Surface Root
 * --------------------------------------------------------------------------------------------- */
interface SurfaceRootProps extends SurfaceVariants {
  class?: string
  children?: JSX.Element
}

const SurfaceRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SurfaceRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as SurfaceRootProps,
    surfaceVariants.variantKeys,
    ["class"]
  )

  return (
    <SurfaceContext.Provider
      value={{
        get variant() {
          return variantProps.variant ?? "default"
        }
      }}
    >
      <Polymorphic
        as="div"
        class={cn(surfaceVariants(variantProps), local.class)}
        data-slot="surface"
        {...rest}
      />
    </SurfaceContext.Provider>
  )
}

export type { SurfaceContextValue, SurfaceRootProps }
export { SurfaceContext, SurfaceRoot }
