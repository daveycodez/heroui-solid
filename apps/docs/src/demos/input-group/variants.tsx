import { Envelope } from "gravity-icons-solid"
import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function Variants() {
  return (
    <div class="flex flex-col gap-4">
      <TextField class="w-[280px]" name="primary">
        <Label>Primary variant</Label>
        <InputGroup variant="primary">
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input placeholder="name@email.com" />
        </InputGroup>
      </TextField>
      <TextField class="w-[280px]" name="secondary">
        <Label>Secondary variant</Label>
        <InputGroup variant="secondary">
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input placeholder="name@email.com" />
        </InputGroup>
      </TextField>
    </div>
  )
}
