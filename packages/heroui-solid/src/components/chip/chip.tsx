import { type ChipVariants, chipVariants, cn } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  children,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Chip Context
 * -----------------------------------------------------------------------------------------------*/
type ChipContextValue = {
  slots?: ReturnType<typeof chipVariants>
}

const ChipContext = createContext<ChipContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Chip Root
 * -----------------------------------------------------------------------------------------------*/
type ChipRootProps<T extends ValidComponent = "span"> = PolymorphicProps<
  T,
  ChipVariants
>

const ChipRoot = <T extends ValidComponent = "span">(
  props: ChipRootProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as ChipRootProps,
    chipVariants.variantKeys,
    ["class", "children"]
  )
  const slots = createMemo(() => chipVariants(variantProps))
  const resolved = children(() => local.children)

  return (
    <ChipContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <Polymorphic
        as="span"
        {...rest}
        class={cn(slots().base(), local.class)}
        data-slot="chip"
      >
        {(() => {
          // Plain-text children wrap in Chip.Label (upstream parity).
          const c = resolved()
          return typeof c === "string" || typeof c === "number" ? (
            <ChipLabel>{c}</ChipLabel>
          ) : (
            c
          )
        })()}
      </Polymorphic>
    </ChipContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Chip Label
 * -----------------------------------------------------------------------------------------------*/
type ChipLabelProps<T extends ValidComponent = "span"> = PolymorphicProps<T>

const ChipLabel = <T extends ValidComponent = "span">(
  props: ChipLabelProps<T>
) => {
  const [local, rest] = splitProps(props as ChipLabelProps, ["class"])
  const context = useContext(ChipContext)

  return (
    <Polymorphic
      as="span"
      {...rest}
      class={cn(context.slots?.label(), local.class)}
      data-slot="chip-label"
    />
  )
}

export type { ChipLabelProps, ChipRootProps }
export { ChipLabel, ChipRoot }
