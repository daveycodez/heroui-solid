import { CircleInfo } from "gravity-icons-solid"
import { Button, Tooltip } from "heroui-solid"

export function TooltipBasic() {
  return (
    <div class="flex items-center gap-4">
      <Tooltip openDelay={0}>
        <Tooltip.Trigger as={Button} variant="secondary">
          Hover me
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>This is a tooltip</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <Tooltip openDelay={0}>
        <Tooltip.Trigger as={Button} isIconOnly variant="tertiary">
          <CircleInfo />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>More information</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
    </div>
  )
}
