import { Description, Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithPrefixAndSuffix() {
  return (
    <TextField class="w-full max-w-[280px]" defaultValue="10" name="price">
      <Label>Set a price</Label>
      <InputGroup>
        <InputGroup.Prefix>$</InputGroup.Prefix>
        <Input class="w-full max-w-[200px]" type="number" />
        <InputGroup.Suffix>USD</InputGroup.Suffix>
      </InputGroup>
      <Description>What customers would pay</Description>
    </TextField>
  )
}
