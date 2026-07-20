import { Envelope } from "gravity-icons-solid"
import {
  Description,
  Input,
  InputGroup,
  Label,
  Surface,
  TextField
} from "heroui-solid"

export function OnSurface() {
  return (
    <Surface class="rounded-2xl p-6">
      <TextField class="w-full max-w-[280px]" name="email">
        <Label>Email address</Label>
        <InputGroup variant="secondary">
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input class="w-full max-w-[280px]" placeholder="name@email.com" />
        </InputGroup>
        <Description>We'll never share this with anyone else</Description>
      </TextField>
    </Surface>
  )
}
