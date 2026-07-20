import { Input, InputGroup, Spinner, TextField } from "heroui-solid"

export function WithLoadingSuffix() {
  return (
    <TextField
      class="w-full max-w-[280px]"
      defaultValue="Sending..."
      name="status"
    >
      <InputGroup>
        <Input class="w-full max-w-[280px]" />
        <InputGroup.Suffix>
          <Spinner class="size-4" />
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
