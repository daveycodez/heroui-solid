import { CircleXmark, Xmark } from "gravity-icons-solid"
import { CloseButton } from "heroui-solid"

export function WithCustomIcon() {
  return (
    <div class="flex items-center gap-4">
      <div class="flex flex-col items-center gap-2">
        <CloseButton>
          <CircleXmark />
        </CloseButton>
        <span class="text-xs text-muted">Custom Icon</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <CloseButton>
          <Xmark />
        </CloseButton>
        <span class="text-xs text-muted">Alternative Icon</span>
      </div>
    </div>
  )
}
