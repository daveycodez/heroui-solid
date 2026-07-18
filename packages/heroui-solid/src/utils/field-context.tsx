import { createContext } from "solid-js"

// Marks descendants as living inside a Kobalte form control, so the standalone
// field satellites (Label, Description, FieldError, Input, TextArea) know
// whether to render the context-bound Kobalte primitive or a plain element
// (Kobalte's form-control primitives throw outside their provider).
const FieldContext = createContext<boolean>()

export { FieldContext }
