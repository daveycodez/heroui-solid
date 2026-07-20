import { Button } from "heroui-solid"

export function Disabled() {
  return (
    <div class="flex flex-wrap gap-3">
      <Button disabled>Primary</Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="tertiary">
        Tertiary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="danger">
        Danger
      </Button>
    </div>
  )
}
