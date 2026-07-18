import { Ellipsis, Gear, TrashBin } from "gravity-icons-solid"
import { Button } from "heroui-solid"

export function IconOnly() {
  return (
    <div class="flex gap-3">
      <Button isIconOnly variant="tertiary">
        <Ellipsis />
      </Button>
      <Button isIconOnly variant="secondary">
        <Gear />
      </Button>
      <Button isIconOnly variant="danger">
        <TrashBin />
      </Button>
    </div>
  )
}
