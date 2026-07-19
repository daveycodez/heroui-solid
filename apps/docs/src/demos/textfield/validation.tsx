import {
  Description,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField
} from "heroui-solid"
import { createSignal, Show } from "solid-js"

export function Validation() {
  const [username, setUsername] = createSignal("")
  const [bio, setBio] = createSignal("")

  const isUsernameInvalid = () => username().length > 0 && username().length < 3
  const isBioInvalid = () => bio().length > 0 && bio().length < 20

  return (
    <div class="flex w-full max-w-64 flex-col gap-4">
      <TextField
        required
        validationState={isUsernameInvalid() ? "invalid" : undefined}
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
        required
        validationState={isBioInvalid() ? "invalid" : undefined}
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
