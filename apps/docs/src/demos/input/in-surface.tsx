import { Input, Surface } from "heroui-solid"

export function InputInSurface() {
  return (
    <Surface
      style={{
        display: "flex",
        height: "180px",
        width: "280px",
        "align-items": "center",
        "justify-content": "center",
        "border-radius": "1.5rem",
        padding: "1rem"
      }}
    >
      <Input fullWidth placeholder="Your name" variant="secondary" />
    </Surface>
  )
}
