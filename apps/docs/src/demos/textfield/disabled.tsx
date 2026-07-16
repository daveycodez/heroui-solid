import { Description, Input, Label, TextField } from "heroui-solid"

export function TextFieldDisabled() {
  return (
    <TextField
      isDisabled
      name="accountId"
      value="USR-12345"
      style={{ width: "100%", "max-width": "16rem" }}
    >
      <Label>Account ID</Label>
      <Input placeholder="Auto-generated" />
      <Description>This field cannot be edited</Description>
    </TextField>
  )
}
