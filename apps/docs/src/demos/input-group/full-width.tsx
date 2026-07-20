import { Envelope, Eye } from "gravity-icons-solid"
import { Input, InputGroup, Label, TextField } from "heroui-solid"

export function FullWidth() {
  return (
    <div class="w-[400px] space-y-4">
      <TextField fullWidth name="email">
        <Label>Email address</Label>
        <InputGroup fullWidth>
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input placeholder="name@email.com" />
        </InputGroup>
      </TextField>
      <TextField fullWidth name="password">
        <Label>Password</Label>
        <InputGroup fullWidth>
          <Input placeholder="Enter password" type="password" />
          <InputGroup.Suffix>
            <Eye class="size-4 text-muted" />
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>
    </div>
  )
}
