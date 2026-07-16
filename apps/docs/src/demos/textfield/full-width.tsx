import { FieldError, Input, Label, TextField } from "heroui-solid"

export function TextFieldFullWidth() {
  return (
    <div
      style={{
        display: "flex",
        width: "400px",
        "max-width": "100%",
        "flex-direction": "column",
        gap: "1rem"
      }}
    >
      <TextField fullWidth name="name">
        <Label>Your name</Label>
        <Input placeholder="John" />
      </TextField>
      <TextField fullWidth isInvalid isRequired name="password">
        <Label>Password</Label>
        <Input type="password" />
        <FieldError>Password must be longer than 8 characters</FieldError>
      </TextField>
    </div>
  )
}
