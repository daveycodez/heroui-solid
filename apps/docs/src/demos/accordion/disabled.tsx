import { Accordion } from "heroui-solid"

export function Disabled() {
  return (
    <div class="flex w-full flex-col items-center gap-8">
      <div class="w-full max-w-md space-y-2">
        <h3 class="text-sm font-medium text-muted">
          Entire accordion disabled
        </h3>
        <Accordion collapsible class="w-full max-w-md">
          <Accordion.Item disabled value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>
                Disabled Item 1
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              This content cannot be accessed when the accordion is disabled.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item disabled value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>
                Disabled Item 2
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              This content cannot be accessed when the accordion is disabled.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div class="w-full max-w-md space-y-2">
        <h3 class="text-sm font-medium text-muted">
          Individual items disabled
        </h3>
        <Accordion collapsible class="w-full max-w-md">
          <Accordion.Item value="active-1">
            <Accordion.Header>
              <Accordion.Trigger>
                Active Item
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              This item is active and can be toggled normally.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item disabled value="disabled-1">
            <Accordion.Header>
              <Accordion.Trigger>
                Disabled Item
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              This content cannot be accessed when the item is disabled.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="active-2">
            <Accordion.Header>
              <Accordion.Trigger>
                Another Active Item
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              This item is also active and can be toggled.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  )
}
