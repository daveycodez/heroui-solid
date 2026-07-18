import { FieldError, Input, Label, TextField } from "heroui-solid"
import { createSignal } from "solid-js"

export function Basic() {
  const [value, setValue] = createSignal("jr")
  const isInvalid = () => value().length > 0 && value().length < 3

  return (
    <TextField
      class="w-64"
      isInvalid={isInvalid()}
      value={value()}
      onChange={setValue}
    >
      <Label for="username">Username</Label>
      <Input id="username" placeholder="Enter username" />
      <FieldError>Username must be at least 3 characters</FieldError>
    </TextField>
  )
}
