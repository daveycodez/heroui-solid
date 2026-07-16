import { Description, Input, Label } from "heroui-solid"

export function DescriptionBasic() {
  return (
    <div
      style={{ display: "flex", "flex-direction": "column", gap: "0.25rem" }}
    >
      <Label for="email">Email</Label>
      <Input
        aria-describedby="email-description"
        id="email"
        placeholder="you@example.com"
        style={{ width: "16rem" }}
        type="email"
      />
      <Description id="email-description">
        We'll never share your email with anyone else.
      </Description>
    </div>
  )
}
