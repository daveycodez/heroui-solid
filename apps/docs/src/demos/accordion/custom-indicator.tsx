import {
  ChevronsDown,
  CircleChevronDown,
  Minus,
  Plus
} from "gravity-icons-solid"
import { Accordion } from "heroui-solid"
import { createSignal, Show } from "solid-js"

export function CustomIndicator() {
  const [value, setValue] = createSignal<string[]>([])

  return (
    <Accordion
      collapsible
      class="w-full max-w-md"
      value={value()}
      variant="surface"
      onChange={setValue}
    >
      <Accordion.Item value="1">
        <Accordion.Header>
          <Accordion.Trigger>
            Using Plus/Minus Icon
            <Accordion.Indicator>
              <Show when={value().includes("1")} fallback={<Plus />}>
                <Minus />
              </Show>
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              This accordion uses a plus icon that transforms when expanded. The
              icon automatically rotates 45 degrees to form an X.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="2">
        <Accordion.Header>
          <Accordion.Trigger>
            Using Caret Icon
            <Accordion.Indicator>
              <CircleChevronDown />
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              This item uses a caret icon for the indicator. The rotation
              animation is applied automatically.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="3">
        <Accordion.Header>
          <Accordion.Trigger>
            Using Arrow Icon
            <Accordion.Indicator>
              <ChevronsDown />
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              This item uses an arrow icon. Any icon you pass will receive the
              rotation animation when the item expands.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
