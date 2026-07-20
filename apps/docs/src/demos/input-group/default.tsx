import { Envelope } from "gravity-icons-solid"
import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function Default() {
  return (
    <TextField class="w-full max-w-[280px]" name="email">
      <Label>Email address</Label>
      <InputGroup>
        <InputGroup.Prefix>
          <Envelope class="size-4 text-muted" />
        </InputGroup.Prefix>
        <Input class="w-full max-w-[280px]" placeholder="name@email.com" />
      </InputGroup>
    </TextField>
  )
}
