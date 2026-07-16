import { Description, Input, Label, TextArea, TextField } from "heroui-solid"
import { createSignal } from "solid-js"

export function TextFieldControlled() {
  const [name, setName] = createSignal("")
  const [bio, setBio] = createSignal("")

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        "max-width": "16rem",
        "flex-direction": "column",
        gap: "1rem"
      }}
    >
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
