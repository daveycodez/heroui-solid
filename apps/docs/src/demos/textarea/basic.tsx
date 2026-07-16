import { TextArea } from "heroui-solid"

export function TextAreaBasic() {
  return (
    <TextArea
      aria-label="Quick project update"
      placeholder="Share a quick project update..."
      style={{ height: "8rem", width: "24rem", "max-width": "100%" }}
    />
  )
}
