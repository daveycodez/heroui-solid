import { Button, Label, ListBox, Select } from "heroui-solid"
import { createSignal, For } from "solid-js"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" },
  { id: "new-york", name: "New York" },
  { id: "washington", name: "Washington" }
]

export function ControlledOpenState() {
  const [isOpen, setIsOpen] = createSignal(false)

  return (
    <div class="space-y-4">
      <Select
        class="w-[256px]"
        isOpen={isOpen()}
        placeholder="Select one"
        onOpenChange={setIsOpen}
      >
        <Label>State</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <For each={states}>
              {(state) => (
                <ListBox.Item id={state.id} textValue={state.name}>
                  {state.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </Select.Popover>
      </Select>
      <Button onClick={() => setIsOpen(!isOpen())}>
        {isOpen() ? "Close" : "Open"} Select
      </Button>
      <p class="text-sm text-muted">Select is {isOpen() ? "open" : "closed"}</p>
    </div>
  )
}
