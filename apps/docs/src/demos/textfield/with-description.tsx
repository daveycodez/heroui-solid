import { Description, Input, Label, TextField } from "heroui-solid"

export function TextFieldWithDescription() {
  return (
    <TextField name="username" style={{ width: "100%", "max-width": "16rem" }}>
      <Label>Username</Label>
      <Input placeholder="Enter username" />
      <Description>Choose a unique username for your account</Description>
    </TextField>
  )
}
