import {
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight
} from "gravity-icons-solid"
import { Button, ButtonGroup } from "heroui-solid"

export function Orientation() {
  return (
    <div class="flex items-start gap-8">
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted">Horizontal</span>
        <ButtonGroup orientation="horizontal" variant="tertiary">
          <Button isIconOnly>
            <TextAlignLeft />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignCenter />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignRight />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignJustify />
          </Button>
        </ButtonGroup>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-muted">Vertical</span>
        <ButtonGroup orientation="vertical" variant="tertiary">
          <Button isIconOnly>
            <TextAlignLeft />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignCenter />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignRight />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignJustify />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
