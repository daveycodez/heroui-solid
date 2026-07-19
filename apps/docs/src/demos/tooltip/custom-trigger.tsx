import { CircleCheckFill, CircleQuestion } from "gravity-icons-solid"
import { Avatar, Chip, Tooltip } from "heroui-solid"

export function TooltipCustomTrigger() {
  return (
    <div class="flex items-center gap-6">
      <Tooltip openDelay={0}>
        <Tooltip.Trigger aria-label="User avatar">
          <Avatar size="sm">
            <Avatar.Image
              alt="Jane Doe"
              src="https://img.heroui.chat/image/avatar?w=400&h=400&u=4"
            />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            <div class="flex flex-col gap-0 py-1">
              <p class="font-semibold">Jane Doe</p>
              <p class="text-xs text-muted">jane@example.com</p>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <Tooltip openDelay={0}>
        <Tooltip.Trigger aria-label="Status chip">
          <Chip color="success">
            <CircleCheckFill width={12} />
            <Chip.Label>Active</Chip.Label>
          </Chip>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content class="flex items-center gap-1.5">
            <span class="relative flex size-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span class="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <p>Jane is currently online</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>

      <Tooltip openDelay={0}>
        <Tooltip.Trigger aria-label="Info icon">
          <div class="rounded-full bg-accent-soft p-2">
            <CircleQuestion class="text-accent-soft-foreground" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>
            <Tooltip.Arrow />
            <div class="max-w-xs px-1 py-1.5">
              <p class="mb-1 font-semibold">Help Information</p>
              <p class="text-sm text-muted">
                This is a helpful tooltip with more detailed information about
                this feature.
              </p>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip>
    </div>
  )
}
