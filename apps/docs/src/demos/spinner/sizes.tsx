import { Spinner } from "heroui-solid"

export function SpinnerSizes() {
  return (
    <div class="flex items-center gap-8">
      <div class="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span class="text-xs text-muted">Small</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span class="text-xs text-muted">Medium</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span class="text-xs text-muted">Large</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span class="text-xs text-muted">Extra Large</span>
      </div>
    </div>
  )
}
