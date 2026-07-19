import { Button, Tooltip } from "heroui-solid"

export function TooltipWithArrow() {
  return (
    <div class="flex items-center gap-4">
      <Tooltip openDelay={0}>
        <Tooltip.Trigger as={Button} variant="secondary">
          With Arrow
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Tooltip with arrow indicator
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <Tooltip gutter={12} openDelay={0}>
        <Tooltip.Trigger as={Button} variant="primary">
          Custom Offset
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Custom offset from trigger
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
    </div>
  )
}
