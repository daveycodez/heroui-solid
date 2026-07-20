import { Envelope } from "gravity-icons-solid"
import { Description, Input, InputGroup, Label, TextField } from "heroui-solid"

export function Required() {
  return (
    <div class="flex flex-col gap-4">
      <TextField required class="w-full max-w-[280px]" name="email">
        <Label>Email address</Label>
        <InputGroup>
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input class="w-full max-w-[280px]" placeholder="name@email.com" />
        </InputGroup>
      </TextField>
      <TextField required class="w-full max-w-[280px]" name="price">
        <Label>Set a price</Label>
        <InputGroup>
          <InputGroup.Prefix>$</InputGroup.Prefix>
          <Input class="w-full max-w-[200px]" placeholder="0" type="number" />
          <InputGroup.Suffix>USD</InputGroup.Suffix>
        </InputGroup>
        <Description>What customers would pay</Description>
      </TextField>
    </div>
  )
}
