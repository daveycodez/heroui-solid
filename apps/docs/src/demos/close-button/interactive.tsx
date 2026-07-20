import { CloseButton } from "heroui-solid"
import { createSignal } from "solid-js"

export function Interactive() {
  const [count, setCount] = createSignal(0)

  return (
    <div class="flex flex-col items-center justify-center gap-4">
      <CloseButton
        aria-label={`Close (clicked ${count()} times)`}
        onClick={() => setCount(count() + 1)}
      />
      <span class="text-sm text-muted">Clicked: {count()} times</span>
    </div>
  )
}
