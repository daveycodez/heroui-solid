import { Button, ButtonGroup } from "heroui-solid"

export function Disabled() {
  return (
    <div class="flex flex-col gap-6">
      <div class="flex flex-col items-start gap-2">
        <p class="text-sm text-muted">All buttons disabled</p>
        <ButtonGroup disabled>
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Third
          </Button>
        </ButtonGroup>
      </div>
      <div class="flex flex-col items-start gap-2">
        <p class="text-sm text-muted">
          Group disabled, but one button overrides
        </p>
        <ButtonGroup disabled>
          <Button>First</Button>
          <Button>
            <ButtonGroup.Separator />
            Second
          </Button>
          <Button disabled={false}>
            <ButtonGroup.Separator />
            Third (enabled)
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
