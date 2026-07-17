import { Plus } from "gravity-icons-solid"
import { Button } from "heroui-solid"

export function FullWidth() {
  return (
    <div class="w-[400px] space-y-3">
      <Button fullWidth>Primary Button</Button>
      <Button fullWidth>
        <Plus />
        With Icon
      </Button>
    </div>
  )
}
