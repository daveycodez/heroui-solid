import { Description, Label, TextArea, TextField } from "heroui-solid"

export function TextFieldTextArea() {
  return (
    <TextField name="message" style={{ width: "100%", "max-width": "16rem" }}>
      <Label>Message</Label>
      <TextArea placeholder="Write your message here..." rows={4} />
      <Description>Maximum 500 characters</Description>
    </TextField>
  )
}
