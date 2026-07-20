import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithTextSuffix() {
  return (
    <TextField
      class="w-full max-w-[280px]"
      defaultValue="heroui"
      name="website"
    >
      <Label>Website</Label>
      <InputGroup>
        <Input class="w-full max-w-[280px]" />
        <InputGroup.Suffix>.com</InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
