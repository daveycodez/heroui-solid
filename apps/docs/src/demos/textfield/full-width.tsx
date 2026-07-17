import { FieldError, Input, Label, TextField } from "heroui-solid"

export function FullWidth() {
  return (
    <div class="w-[400px] space-y-4">
      <TextField fullWidth name="name">
        <Label>Your name</Label>
        <Input placeholder="John" />
      </TextField>
      <TextField fullWidth isInvalid isRequired name="password">
        <Label>Password</Label>
        <Input type="password" />
        <FieldError>Password must be longer than 8 characters</FieldError>
      </TextField>
    </div>
  )
}
