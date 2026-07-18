import { createSignal } from "solid-js"

interface UseOverlayStateProps {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

interface OverlayState {
  readonly isOpen: boolean
  setOpen: (isOpen: boolean) => void
  open: () => void
  close: () => void
  toggle: () => void
}

// Convenience open-state helper for controlling AlertDialog.Backdrop, mirroring
// HeroUI React's `useOverlayState`. `isOpen` is a reactive getter.
function useOverlayState(props: UseOverlayStateProps = {}): OverlayState {
  const [internalOpen, setInternalOpen] = createSignal(
    props.defaultOpen ?? false
  )
  const isControlled = () => props.isOpen !== undefined
  const isOpen = () => (isControlled() ? !!props.isOpen : internalOpen())
  const setOpen = (open: boolean) => {
    if (!isControlled()) setInternalOpen(open)
    props.onOpenChange?.(open)
  }

  return {
    get isOpen() {
      return isOpen()
    },
    setOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen())
  }
}

export type { OverlayState, UseOverlayStateProps }
export { useOverlayState }
