import {
  Description,
  ErrorMessage,
  Input,
  Label,
  TextField
} from "heroui-solid"
import { createSignal } from "solid-js"

export function ErrorMessageBasic() {
  const [value, setValue] = createSignal("")

  const isInvalid = () => value().length > 0 && value().length < 3

  return (
    <TextField
      class="w-full max-w-64"
      name="username"
      onChange={setValue}
      validationState={isInvalid() ? "invalid" : undefined}
      value={value()}
    >
      <Label>Username</Label>
      <Input placeholder="jane_doe" />
      <Description>Enter at least 3 characters</Description>
      <ErrorMessage>
        {isInvalid() && <>Username must be at least 3 characters</>}
      </ErrorMessage>
    </TextField>
  )
}
