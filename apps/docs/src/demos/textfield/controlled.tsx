import { Description, Input, Label, TextArea, TextField } from "heroui-solid"
import { createSignal } from "solid-js"

export function Controlled() {
  const [name, setName] = createSignal("")
  const [bio, setBio] = createSignal("")

  return (
    <div class="flex w-full max-w-64 flex-col gap-4">
      <TextField name="name" value={name()} onChange={setName}>
        <Label>Display name</Label>
        <Input placeholder="Jane" />
        <Description>Characters: {name().length}</Description>
      </TextField>
      <TextField name="bio" value={bio()} onChange={setBio}>
        <Label>Bio</Label>
        <TextArea placeholder="Tell us about yourself..." />
        <Description>Characters: {bio().length} / 200</Description>
      </TextField>
    </div>
  )
}
