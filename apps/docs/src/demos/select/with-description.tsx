import { Description, Label, ListBox, Select } from "heroui-solid"
import { For } from "solid-js"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" },
  { id: "new-york", name: "New York" },
  { id: "washington", name: "Washington" }
]

export function WithDescription() {
  return (
    <Select class="w-[256px]" placeholder="Select one">
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
      <Description>Select your state of residence</Description>
    </Select>
  )
}
