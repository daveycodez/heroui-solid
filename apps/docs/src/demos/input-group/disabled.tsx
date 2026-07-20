import { Envelope } from "gravity-icons-solid"
import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function Disabled() {
  return (
    <div class="flex flex-col gap-4">
      <TextField
        disabled
        class="w-full max-w-[280px]"
        defaultValue="name@email.com"
        name="email"
      >
        <Label>Email address</Label>
        <InputGroup>
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input class="w-full max-w-[280px]" />
        </InputGroup>
      </TextField>
      <TextField
        disabled
        class="w-full max-w-[280px]"
        defaultValue="10"
        name="price"
      >
        <Label>Set a price</Label>
        <InputGroup>
          <InputGroup.Prefix>$</InputGroup.Prefix>
          <Input class="w-full max-w-[200px]" type="number" />
          <InputGroup.Suffix>USD</InputGroup.Suffix>
        </InputGroup>
      </TextField>
    </div>
  )
}
