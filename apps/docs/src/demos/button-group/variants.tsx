import { Button, ButtonGroup } from "heroui-solid"

export function Variants() {
  return (
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted">Primary</p>
        <ButtonGroup variant="primary">
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
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted">Secondary</p>
        <ButtonGroup variant="secondary">
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
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted">Tertiary</p>
        <ButtonGroup variant="tertiary">
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
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted">Outline</p>
        <ButtonGroup variant="outline">
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
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted">Ghost</p>
        <ButtonGroup variant="ghost">
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
      <div class="flex flex-col gap-2">
        <p class="text-sm text-muted">Danger</p>
        <ButtonGroup variant="danger">
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
    </div>
  )
}
