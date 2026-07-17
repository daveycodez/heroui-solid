import { Input, Label, TextField } from "heroui-solid"

export function Basic() {
  return (
    <TextField class="w-full max-w-64" name="email">
      <Label>Email</Label>
      <Input placeholder="Enter your email" type="email" />
    </TextField>
  )
}
