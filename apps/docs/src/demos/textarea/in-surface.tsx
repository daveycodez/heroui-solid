import { Surface, TextArea } from "heroui-solid"

export function TextAreaInSurface() {
  return (
    <Surface
      style={{
        width: "100%",
        "max-width": "24rem",
        "border-radius": "1.5rem",
        padding: "1.5rem"
      }}
    >
      <TextArea
        fullWidth
        placeholder="Describe your product"
        style={{ "min-width": "280px" }}
        variant="secondary"
      />
    </Surface>
  )
}
