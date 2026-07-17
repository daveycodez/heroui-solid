import { Button } from "heroui-solid"
import Ellipsis from "~icons/gravity-ui/ellipsis"
import Gear from "~icons/gravity-ui/gear"
import TrashBin from "~icons/gravity-ui/trash-bin"

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
