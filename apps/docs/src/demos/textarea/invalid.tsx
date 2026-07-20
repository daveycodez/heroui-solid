import { FieldError, Label, TextArea, TextField } from "heroui-solid"

export function Invalid() {
  return (
    <TextField validationState="invalid" class="w-full max-w-96" name="bio">
      <Label>Bio</Label>
      <TextArea placeholder="Tell us about yourself..." />
      <FieldError>Bio must contain at least 20 characters.</FieldError>
    </TextField>
  )
}
