import { Description, Input, Label, TextField } from "heroui-solid"

export function TextFieldRequired() {
  return (
    <TextField
      isRequired
      name="fullName"
      style={{ width: "100%", "max-width": "16rem" }}
    >
      <Label>Full Name</Label>
      <Input placeholder="John Doe" />
      <Description>This field is required</Description>
    </TextField>
  )
}
