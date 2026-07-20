import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithTextPrefix() {
  return (
    <TextField
      class="w-full max-w-[280px]"
      defaultValue="heroui.com"
      name="website"
    >
      <Label>Website</Label>
      <InputGroup>
        <InputGroup.Prefix>https://</InputGroup.Prefix>
        <Input class="w-full max-w-[280px]" />
      </InputGroup>
    </TextField>
  )
}
