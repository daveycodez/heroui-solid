import { createContext, type JSX, useContext } from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * ListLayout
 * -----------------------------------------------------------------------------------------------*/
// React Aria's ListLayout (a layout strategy consumed by its Virtualizer) has no
// Solid equivalent; the port keys virtualization off @tanstack/solid-virtual and
// treats ListLayout as a marker selecting the fixed-row-height list strategy.
const ListLayout = { type: "list" } as const

/* -------------------------------------------------------------------------------------------------
 * Virtualizer Context
 * -----------------------------------------------------------------------------------------------*/
type VirtualizerContextValue = {
  rowHeight: () => number
}

const VirtualizerContext = createContext<VirtualizerContextValue>()

const useVirtualizer = () => useContext(VirtualizerContext)

/* -------------------------------------------------------------------------------------------------
 * Virtualizer
 * -----------------------------------------------------------------------------------------------*/
interface VirtualizerProps {
  layout?: typeof ListLayout
  layoutOptions?: { rowHeight?: number }
  children?: JSX.Element
}

// Wraps a collection (e.g. ListBox) and provides the row-height layout config the
// collection uses to virtualize. The collection performs the actual windowing
// (via Kobalte's `virtualized` mode + @tanstack/solid-virtual) — mirroring how
// React Aria's Virtualizer supplies a layout its collection reads from context.
const Virtualizer = (props: VirtualizerProps) => {
  return (
    <VirtualizerContext.Provider
      value={{ rowHeight: () => props.layoutOptions?.rowHeight ?? 40 }}
    >
      {props.children}
    </VirtualizerContext.Provider>
  )
}

export type { VirtualizerContextValue, VirtualizerProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { ListLayout, useVirtualizer, Virtualizer, VirtualizerContext }
