import { Description, Input, Label, TextField } from "heroui-solid"

export function WithDescription() {
  return (
    <TextField class="w-full max-w-64" name="username">
      <Label>Username</Label>
      <Input placeholder="Enter username" />
      <Description>Choose a unique username for your account</Description>
    </TextField>
  )
}
