import { Input, Label, TextField } from "heroui-solid"

export function TextFieldBasic() {
  return (
    <TextField name="email" style={{ width: "100%", "max-width": "16rem" }}>
      <Label>Email</Label>
      <Input placeholder="Enter your email" type="email" />
    </TextField>
  )
}
