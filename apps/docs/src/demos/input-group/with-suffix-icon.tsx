import { Envelope } from "gravity-icons-solid"
import { Description, Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithSuffixIcon() {
  return (
    <TextField class="w-full max-w-[280px]" name="email">
      <Label>Email address</Label>
      <InputGroup>
        <Input class="w-full max-w-[280px]" placeholder="name@email.com" />
        <InputGroup.Suffix>
          <Envelope class="size-4 text-muted" />
        </InputGroup.Suffix>
      </InputGroup>
      <Description>We don't send spam</Description>
    </TextField>
  )
}
