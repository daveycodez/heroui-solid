import { Input } from "heroui-solid"

export function InputFullWidth() {
  return (
    <div style={{ width: "400px", "max-width": "100%" }}>
      <Input fullWidth placeholder="Full width input" />
    </div>
  )
}
