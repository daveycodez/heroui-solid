import { Input } from "heroui-solid"

export function InputVariants() {
  return (
    <div
      style={{
        display: "flex",
        width: "240px",
        "flex-direction": "column",
        gap: "0.5rem"
      }}
    >
      <Input fullWidth placeholder="Primary input" variant="primary" />
      <Input fullWidth placeholder="Secondary input" variant="secondary" />
    </div>
  )
}
