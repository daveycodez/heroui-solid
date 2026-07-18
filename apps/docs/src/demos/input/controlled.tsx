import { Input } from "heroui-solid"
import { createSignal } from "solid-js"

export function Controlled() {
  const [value, setValue] = createSignal("heroui.com")

  return (
    <div class="flex w-80 flex-col gap-2">
      <Input
        aria-label="Domain"
        placeholder="domain"
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <span class="px-1 text-sm text-muted">
        https://{value() || "your-domain"}
      </span>
    </div>
  )
}
