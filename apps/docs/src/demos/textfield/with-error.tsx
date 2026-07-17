import { FieldError, Input, Label, TextField } from "heroui-solid"

export function WithError() {
  return (
    <TextField isInvalid class="w-full max-w-64" name="email">
      <Label>Email</Label>
      <Input placeholder="user@example.com" type="email" />
      <FieldError>Please enter a valid email address</FieldError>
    </TextField>
  )
}
