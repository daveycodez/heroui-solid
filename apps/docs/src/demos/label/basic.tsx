import { Input, Label } from "heroui-solid"

export function LabelBasic() {
  return (
    <div
      style={{ display: "flex", "flex-direction": "column", gap: "0.25rem" }}
    >
      <Label for="name">Name</Label>
      <Input
        id="name"
        placeholder="Enter your name"
        style={{ width: "16rem" }}
        type="text"
      />
    </div>
  )
}
