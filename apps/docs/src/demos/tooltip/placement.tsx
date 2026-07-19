import { Button, Tooltip } from "heroui-solid"

export function TooltipPlacement() {
  return (
    <div class="grid grid-cols-3 gap-4">
      <div />
      <Tooltip openDelay={0} placement="top">
        <Tooltip.Trigger as={Button} class="w-full" variant="tertiary">
          Top
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Top placement
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
      <div />

      <Tooltip openDelay={0} placement="left">
        <Tooltip.Trigger as={Button} class="w-full" variant="tertiary">
          Left
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Left placement
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <div class="flex items-center justify-center">
        <span class="text-sm text-muted">Hover buttons</span>
      </div>

      <Tooltip openDelay={0} placement="right">
        <Tooltip.Trigger as={Button} class="w-full" variant="tertiary">
          Right
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Right placement
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <div />
      <Tooltip openDelay={0} placement="bottom">
        <Tooltip.Trigger as={Button} class="w-full" variant="tertiary">
          Bottom
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Bottom placement
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
      <div />
    </div>
  )
}
