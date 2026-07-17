import { Button } from "heroui-solid"
import Plus from "~icons/gravity-ui/plus"

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
