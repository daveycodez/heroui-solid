import { cn, type SurfaceVariants, surfaceVariants } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { createContext, splitProps, type ValidComponent } from "solid-js"

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
type SurfaceRootProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  SurfaceVariants
>

const SurfaceRoot = <T extends ValidComponent = "div">(
  props: SurfaceRootProps<T>
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
