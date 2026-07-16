import { Input, Label } from "heroui-solid"

const fieldStyle = {
  display: "flex",
  "flex-direction": "column",
  gap: "0.25rem"
} as const

export function InputTypes() {
  return (
    <div
      style={{
        display: "flex",
        width: "20rem",
        "flex-direction": "column",
        gap: "1rem"
      }}
    >
      <div style={fieldStyle}>
        <Label for="input-type-email">Email</Label>
        <Input
          id="input-type-email"
          placeholder="jane@example.com"
          type="email"
        />
      </div>
      <div style={fieldStyle}>
        <Label for="input-type-number">Age</Label>
        <Input id="input-type-number" min={0} placeholder="30" type="number" />
      </div>
      <div style={fieldStyle}>
        <Label for="input-type-password">Password</Label>
        <Input
          id="input-type-password"
          placeholder="••••••••"
          type="password"
        />
      </div>
    </div>
  )
}
