import { Button, Tooltip } from "heroui-solid"

export function TooltipWithoutPortal() {
  return (
    <Tooltip openDelay={0}>
      <Tooltip.Trigger as={Button} variant="secondary">
        Hover me
      </Tooltip.Trigger>
      <Tooltip.Content>Rendered inline, without a portal</Tooltip.Content>
    </Tooltip>
  )
}
