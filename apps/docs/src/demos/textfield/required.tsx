import { Description, Input, Label, TextField } from "heroui-solid"

export function TextFieldRequired() {
  return (
    <TextField isRequired class="w-full max-w-64" name="fullName">
      <Label>Full Name</Label>
      <Input placeholder="John Doe" />
      <Description>This field is required</Description>
    </TextField>
  )
}
