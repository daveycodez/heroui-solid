import { FieldError, Input, Label, TextField } from "heroui-solid"
import { createSignal } from "solid-js"

export function FieldErrorBasic() {
  const [value, setValue] = createSignal("jr")
  const isInvalid = () => value().length > 0 && value().length < 3

  return (
    <TextField
      isInvalid={isInvalid()}
      value={value()}
      onChange={setValue}
      style={{ width: "16rem" }}
    >
      <Label>Username</Label>
      <Input placeholder="Enter username" />
      <FieldError>Username must be at least 3 characters</FieldError>
    </TextField>
  )
}
