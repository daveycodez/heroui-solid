import { createContext } from "solid-js"

// Marks the trigger slot of a menu: Dropdown's root provides `true`, its
// popover resets to `false`. Button renders Kobalte's menu trigger when the
// marker is set — mirroring React Aria's MenuTrigger button slotting, which
// lets upstream demos place a plain <Button> as the dropdown trigger.
export const MenuTriggerContext = createContext<boolean>(false)
