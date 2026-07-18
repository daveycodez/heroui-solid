import { createContext, onCleanup } from "solid-js"

// Marks the trigger slot of a menu: Dropdown's root provides `true`, its
// popover resets to `false`. Button renders Kobalte's menu trigger when the
// marker is set — mirroring React Aria's MenuTrigger button slotting, which
// lets upstream demos place a plain <Button> as the dropdown trigger.
export const MenuTriggerContext = createContext<boolean>(false)

// Trigger interaction behavior, provided by Dropdown's root alongside the
// trigger marker (React Aria's MenuTrigger `trigger` prop).
export interface MenuTriggerBehaviorValue {
  trigger: "press" | "longPress"
  isOpen: boolean
  open: () => void
}

export const MenuTriggerBehaviorContext = createContext<
  MenuTriggerBehaviorValue | undefined
>()

// React Aria's long-press threshold.
const LONG_PRESS_MS = 500

// Port of React Aria's trigger="longPress" interactions. Kobalte's trigger
// opens on pointerdown/keydown without checking defaultPrevented, so these
// at-target (`on:*`) handlers run before its document-delegated ones and
// stopPropagation keeps them from firing; the menu opens only after a 500ms
// hold or Alt+ArrowDown/ArrowUp, via the root-controlled open state.
export const createLongPressHandlers = (
  behavior: MenuTriggerBehaviorValue | undefined
) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  let longPressed = false
  const active = () => behavior?.trigger === "longPress"
  const cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }
  // Trigger may unmount mid-hold (route change / conditional render) before
  // pointerup — clear the pending timer so it can't open() a disposed owner.
  onCleanup(cancel)

  return {
    onPointerDown: (event: PointerEvent) => {
      if (!active() || !behavior || behavior.isOpen) return
      event.stopPropagation()
      longPressed = false
      if (event.button === 0) {
        cancel()
        timer = setTimeout(() => {
          timer = undefined
          longPressed = true
          behavior.open()
        }, LONG_PRESS_MS)
      }
    },
    onPointerUp: () => cancel(),
    onPointerLeave: () => cancel(),
    onPointerCancel: () => {
      cancel()
      longPressed = false
    },
    onClick: (event: MouseEvent) => {
      if (!active() || !behavior) return
      // Block the aborted-press click while closed, and the trailing click of
      // a completed long press (Kobalte's touch path would toggle-close).
      if (longPressed || !behavior.isOpen) {
        event.preventDefault()
        event.stopPropagation()
      }
      longPressed = false
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (!active() || !behavior || behavior.isOpen) return
      if (
        event.altKey &&
        (event.key === "ArrowDown" || event.key === "ArrowUp")
      ) {
        event.preventDefault()
        event.stopPropagation()
        behavior.open()
      } else if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.stopPropagation()
      }
    },
    onContextMenu: (event: Event) => {
      if (!active()) return
      event.preventDefault()
    }
  }
}
