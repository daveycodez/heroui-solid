import { FieldError, Input, Label, TextField } from "heroui-solid"

export function TextFieldErrorMessage() {
  return (
    <TextField
      isInvalid
      name="email"
      style={{ width: "100%", "max-width": "16rem" }}
    >
      <Label>Email</Label>
      <Input placeholder="user@example.com" type="email" />
      <FieldError>Please enter a valid email address</FieldError>
    </TextField>
  )
}
