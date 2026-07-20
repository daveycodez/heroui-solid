import { Envelope } from "gravity-icons-solid"
import { FieldError, Input, InputGroup, Label, TextField } from "heroui-solid"

export function Invalid() {
  return (
    <div class="flex flex-col gap-4">
      <TextField
        required
        class="w-full max-w-[280px]"
        name="email"
        validationState="invalid"
      >
        <Label>Email address</Label>
        <InputGroup>
          <InputGroup.Prefix>
            <Envelope class="size-4 text-muted" />
          </InputGroup.Prefix>
          <Input class="w-full max-w-[280px]" placeholder="name@email.com" />
        </InputGroup>
        <FieldError>Please enter a valid email address</FieldError>
      </TextField>
      <TextField
        required
        class="w-full max-w-[280px]"
        name="price"
        validationState="invalid"
      >
        <Label>Set a price</Label>
        <InputGroup>
          <InputGroup.Prefix>$</InputGroup.Prefix>
          <Input class="w-full max-w-[200px]" placeholder="0" type="number" />
          <InputGroup.Suffix>USD</InputGroup.Suffix>
        </InputGroup>
        <FieldError>Price must be greater than 0</FieldError>
      </TextField>
    </div>
  )
}
