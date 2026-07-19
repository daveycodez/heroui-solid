import { createVirtualizer } from "@tanstack/solid-virtual"
import {
  type Accessor,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount
} from "solid-js"

// Rows the virtualizer seeds into its first window (SSR + pre-mount hydration),
// before the scroll element can be measured. See attachScrollEl / initialRect.
const SSR_ESTIMATED_ROWS = 12

// Minimal shape of the Kobalte collection passed to a virtualized listbox's
// render-prop children — enough to look up a windowed row by key.
export interface VirtualizedCollection<T> {
  getItem: (key: string) => T | undefined
}

export interface ListVirtualizerConfig {
  // Estimated row height (px). Drives estimateSize + the SSR seed height.
  rowHeight: () => number
  // Number of options in the full collection.
  count: () => number
  // Stable key per index (matches Kobalte's collection keys / optionValue).
  getItemKey: (index: number) => string | number
}

export interface ListVirtualizer<T> {
  // Ref for the scroll element (the Kobalte listbox <ul>). Stores it; the
  // virtualizer picks it up post-mount (see attachScrollEl).
  setScrollElement: (el: HTMLElement) => void
  // Scroll a given row index into view (wire to the listbox `scrollToItem`).
  scrollToIndex: (index: number) => void
  // Windowed rows for `collection`. Call inside the listbox's render-prop
  // children — returns the absolutely-positioned rows inside a total-size
  // spacer. `renderRow` receives the collection node + its positioning style.
  renderWindow: (
    collection: Accessor<VirtualizedCollection<T>>,
    renderRow: (node: T, style: JSX.CSSProperties) => JSX.Element
  ) => JSX.Element
}

// Shared @tanstack/solid-virtual windowing for Kobalte listbox-based
// collections (standalone ListBox, Select-backed Autocomplete, Combobox).
// Encapsulates the SSR-seeded initial window and the connected-gate /
// post-mount scroll-element attach that keep client-side navigation and
// hydration correct — see the inline notes and AGENTS.md (SSR/Hydration Rules).
export function createListVirtualizer<T>(
  config: ListVirtualizerConfig
): ListVirtualizer<T> {
  // The scroll element is a signal, not a plain ref: reading it inside
  // getScrollElement lets the adapter's reactive setOptions/_willUpdate
  // re-observe the element once it's handed over.
  const [scrollEl, setScrollEl] = createSignal<HTMLElement>()
  let scrollElRef: HTMLElement | undefined
  // Hand the scroll element to the virtualizer only *after* mount, and only
  // once it's connected. Two hazards drive this:
  //  - The real measurement must not land mid-hydration. Until scrollEl is set
  //    the window comes from `initialRect`, so SSR and the client's pre-mount
  //    hydration render the same seeded rows; setting it during hydration would
  //    reconcile the window to the measured size mid-flight, and that DOM update
  //    is silently dropped (see AGENTS.md), stranding the seeded overflow rows.
  //    onMount runs after hydration settles, so the reconcile applies cleanly.
  //  - On client-side navigation Kobalte forwards the ref while the <ul> is
  //    still detached (`isConnected === false`). @tanstack/virtual measures
  //    synchronously at attach (offsetHeight 0 on a detached node) and registers
  //    its ResizeObserver against that detached element, which never fires —
  //    leaving the list blank until reload. Waiting for `isConnected` means the
  //    adapter measures the real height and observes a live element.
  let attachRaf: number | undefined
  const attachScrollEl = (el: HTMLElement) => {
    // A newer ref superseded this element — abandon the stale poll so it never
    // reconnects and replaces the active scroll element, and so the rAF loop
    // stops instead of retaining a detached node forever.
    if (el !== scrollElRef) return
    if (el.isConnected) {
      setScrollEl(el)
      return
    }
    attachRaf = requestAnimationFrame(() => attachScrollEl(el))
  }
  onCleanup(() => {
    if (attachRaf !== undefined) cancelAnimationFrame(attachRaf)
  })
  // After the first mount, a fresh scroll element can arrive (e.g. an
  // Autocomplete's listbox unmounts to show an empty state, then remounts when
  // results return). onMount fires only once, so attach directly on the ref in
  // that case; the connected-gate still applies. Before mount we only store, so
  // SSR'd listboxes keep rendering the seeded window until hydration settles.
  let isMounted = false
  const attachOnRef = (el: HTMLElement) => {
    if (isMounted) attachScrollEl(el)
  }
  onMount(() => {
    isMounted = true
    if (scrollElRef) attachScrollEl(scrollElRef)
  })

  const virtualizer = createVirtualizer({
    get count() {
      return config.count()
    },
    getScrollElement: () => scrollEl() ?? null,
    estimateSize: () => config.rowHeight(),
    getItemKey: (index) => config.getItemKey(index),
    overscan: 5,
    // Seed a first-viewport estimate so SSR and pre-mount hydration render a
    // non-empty window (no measurements yet). Deliberately generous — a taller
    // estimate SSRs a few extra rows that trim on mount (invisible); too short
    // leaves a gap below the fold until mount.
    initialRect: {
      width: 0,
      height: config.rowHeight() * SSR_ESTIMATED_ROWS
    }
  })

  const renderWindow = (
    collection: Accessor<VirtualizedCollection<T>>,
    renderRow: (node: T, style: JSX.CSSProperties) => JSX.Element
  ) => (
    <div
      style={{
        height: `${virtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative"
      }}
    >
      <For each={virtualizer.getVirtualItems()}>
        {(row) => {
          const node = collection().getItem(row.key as string)
          return node
            ? renderRow(node, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                transform: `translateY(${row.start}px)`
              })
            : null
        }}
      </For>
    </div>
  )

  return {
    setScrollElement: (el) => {
      scrollElRef = el
      attachOnRef(el)
    },
    scrollToIndex: (index) => virtualizer.scrollToIndex(index),
    renderWindow
  }
}
