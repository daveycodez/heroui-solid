import { Globe } from "gravity-icons-solid"
import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithIconPrefixAndTextSuffix() {
  return (
    <TextField
      class="w-full max-w-[280px]"
      defaultValue="heroui"
      name="website"
    >
      <Label>Website</Label>
      <InputGroup>
        <InputGroup.Prefix>
          <Globe class="size-4 text-muted" />
        </InputGroup.Prefix>
        <Input class="w-full max-w-[280px]" />
        <InputGroup.Suffix>.com</InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
