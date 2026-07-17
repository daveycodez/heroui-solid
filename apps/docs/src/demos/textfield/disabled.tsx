import { Description, Input, Label, TextField } from "heroui-solid"

export function Disabled() {
  return (
    <TextField
      isDisabled
      class="w-full max-w-64"
      name="accountId"
      value="USR-12345"
    >
      <Label>Account ID</Label>
      <Input placeholder="Auto-generated" />
      <Description>This field cannot be edited</Description>
    </TextField>
  )
}
