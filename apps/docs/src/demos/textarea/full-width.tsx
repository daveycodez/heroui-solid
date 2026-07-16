import { TextArea } from "heroui-solid"

export function TextAreaFullWidth() {
  return (
    <div style={{ width: "400px", "max-width": "100%" }}>
      <TextArea fullWidth placeholder="Full width textarea" />
    </div>
  )
}
