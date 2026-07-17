import { Input, Label, TextField } from "heroui-solid"

export function TextFieldInputTypes() {
  return (
    <div class="flex w-full max-w-64 flex-col gap-4">
      <TextField name="password">
        <Label>Password</Label>
        <Input placeholder="••••••••" type="password" />
      </TextField>

      <TextField name="age">
        <Label>Age</Label>
        <Input max="150" min="0" placeholder="21" type="number" />
      </TextField>

      <TextField name="email">
        <Label>Email</Label>
        <Input placeholder="user@example.com" type="email" />
      </TextField>

      <TextField name="website">
        <Label>Website</Label>
        <Input placeholder="https://example.com" type="url" />
      </TextField>

      <TextField name="phone">
        <Label>Phone</Label>
        <Input placeholder="+1 (555) 000-0000" type="tel" />
      </TextField>
    </div>
  )
}
