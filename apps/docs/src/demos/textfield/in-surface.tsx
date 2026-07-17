import {
  Description,
  Input,
  Label,
  Surface,
  TextArea,
  TextField
} from "heroui-solid"

export function TextFieldInSurface() {
  return (
    <Surface class="flex w-full min-w-[340px] flex-col gap-4 rounded-3xl p-6">
      <TextField name="name" variant="secondary">
        <Label>Your name</Label>
        <Input fullWidth placeholder="John" />
        <Description>We'll never share this with anyone else</Description>
      </TextField>
      <TextField name="email" variant="secondary">
        <Label>Email</Label>
        <Input fullWidth placeholder="john@example.com" type="email" />
      </TextField>
      <TextField name="bio" variant="secondary">
        <Label>Bio</Label>
        <TextArea fullWidth placeholder="Tell us about yourself..." rows={4} />
        <Description>Minimum 4 rows</Description>
      </TextField>
    </Surface>
  )
}
