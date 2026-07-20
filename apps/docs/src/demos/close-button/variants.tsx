import { CloseButton } from "heroui-solid"

export function Variants() {
  return (
    <div class="flex items-center gap-4">
      <div class="flex flex-col items-center gap-2">
        <CloseButton />
        <span class="text-xs text-muted">Default</span>
      </div>
    </div>
  )
}
