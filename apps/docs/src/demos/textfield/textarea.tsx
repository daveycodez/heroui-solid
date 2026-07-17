import { Description, Label, TextArea, TextField } from "heroui-solid"

export function TextAreaExample() {
  return (
    <TextField class="w-full max-w-64" name="message">
      <Label>Message</Label>
      <TextArea placeholder="Write your message here..." rows={4} />
      <Description>Maximum 500 characters</Description>
    </TextField>
  )
}
