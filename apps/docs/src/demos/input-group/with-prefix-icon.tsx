import { Envelope } from "gravity-icons-solid"
import { Description, Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithPrefixIcon() {
  return (
    <TextField class="w-full max-w-[280px]" name="email">
      <Label>Email address</Label>
      <InputGroup>
        <InputGroup.Prefix>
          <Envelope class="size-4 text-muted" />
        </InputGroup.Prefix>
        <Input class="w-full max-w-[280px]" placeholder="name@email.com" />
      </InputGroup>
      <Description>We'll never share this with anyone else</Description>
    </TextField>
  )
}
