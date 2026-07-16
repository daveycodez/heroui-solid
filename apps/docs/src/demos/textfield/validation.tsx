import {
  Description,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField
} from "heroui-solid"
import { createSignal, Show } from "solid-js"

export function TextFieldValidation() {
  const [username, setUsername] = createSignal("")
  const [bio, setBio] = createSignal("")

  const isUsernameInvalid = () => username().length > 0 && username().length < 3
  const isBioInvalid = () => bio().length > 0 && bio().length < 20

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
      <TextField
        isRequired
        isInvalid={isUsernameInvalid()}
        name="username"
        value={username()}
        onChange={setUsername}
      >
        <Label>Username</Label>
        <Input placeholder="jane_doe" />
        <Show
          when={isUsernameInvalid()}
          fallback={
            <Description>
              Choose a unique username for your profile.
            </Description>
          }
        >
          <FieldError>Username must be at least 3 characters.</FieldError>
        </Show>
      </TextField>

      <TextField
        isRequired
        isInvalid={isBioInvalid()}
        name="bio"
        value={bio()}
        onChange={setBio}
      >
        <Label>Bio</Label>
        <TextArea placeholder="Tell us about yourself..." />
        <Show
          when={isBioInvalid()}
          fallback={
            <Description>
              Minimum 20 characters ({bio().length}/20).
            </Description>
          }
        >
          <FieldError>Bio must contain at least 20 characters.</FieldError>
        </Show>
      </TextField>
    </div>
  )
}
