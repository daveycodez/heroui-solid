import { Input } from "heroui-solid"
import { createSignal } from "solid-js"

export function InputControlled() {
  const [value, setValue] = createSignal("heroui.com")

  return (
    <div
      style={{
        display: "flex",
        width: "20rem",
        "flex-direction": "column",
        gap: "0.5rem"
      }}
    >
      <Input
        aria-label="Domain"
        placeholder="domain"
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <span
        style={{
          padding: "0 0.25rem",
          "font-size": "0.875rem",
          color: "var(--muted)"
        }}
      >
        https://{value() || "your-domain"}
      </span>
    </div>
  )
}
