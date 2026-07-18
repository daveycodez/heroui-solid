import { type ChipVariants, chipVariants, cn } from "@heroui/styles"
import {
  type ComponentProps,
  createContext,
  createMemo,
  splitProps,
  useContext
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
interface ChipRootProps extends ComponentProps<"span"> {
  color?: ChipVariants["color"]
  size?: ChipVariants["size"]
  variant?: ChipVariants["variant"]
}

const ChipRoot = (props: ChipRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    chipVariants.variantKeys,
    ["class", "children"]
  )
  const slots = createMemo(() => chipVariants(variantProps))

  return (
    <ChipContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <span {...rest} class={cn(slots().base(), local.class)} data-slot="chip">
        {(() => {
          // Plain-text children wrap in Chip.Label (single read — AGENTS.md).
          const c = local.children
          return typeof c === "string" || typeof c === "number" ? (
            <ChipLabel>{c}</ChipLabel>
          ) : (
            c
          )
        })()}
      </span>
    </ChipContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Chip Label
 * -----------------------------------------------------------------------------------------------*/
interface ChipLabelProps extends ComponentProps<"span"> {}

const ChipLabel = (props: ChipLabelProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useContext(ChipContext)

  return (
    <span
      {...rest}
      class={cn(context.slots?.label(), local.class)}
      data-slot="chip-label"
    >
      {local.children}
    </span>
  )
}

export type { ChipLabelProps, ChipRootProps }
export { ChipLabel, ChipRoot }
