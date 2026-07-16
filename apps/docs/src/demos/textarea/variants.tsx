import { TextArea } from "heroui-solid"

export function TextAreaVariants() {
  return (
    <div
      style={{
        display: "flex",
        width: "280px",
        "flex-direction": "column",
        gap: "0.5rem"
      }}
    >
      <TextArea fullWidth placeholder="Primary textarea" variant="primary" />
      <TextArea
        fullWidth
        placeholder="Secondary textarea"
        variant="secondary"
      />
    </div>
  )
}
