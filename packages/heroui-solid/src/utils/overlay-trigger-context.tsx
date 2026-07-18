import { createContext } from "solid-js"

// Wires a plain Button (or CloseButton) to the enclosing AlertDialog, mirroring
// React Aria's slotted-button behavior: a button in the trigger region opens
// the dialog, and a `slot="close"` button closes it. AlertDialog.Root provides
// `{ open }` around the trigger; AlertDialog.Backdrop provides `{ close }` (and
// no `open`) around the portalled content, so footer buttons close but never
// reopen. Lives in utils to keep button.tsx free of an alert-dialog import.
type OverlayTriggerContextValue = {
  open?: () => void
  close?: () => void
}

const OverlayTriggerContext = createContext<OverlayTriggerContextValue>({})

export type { OverlayTriggerContextValue }
export { OverlayTriggerContext }
