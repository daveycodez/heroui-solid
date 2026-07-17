import { Label, ListBox, Select } from "heroui-solid"
import { For } from "solid-js"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" }
]

export function SelectDisabled() {
  return (
    <Select
      defaultValue="california"
      isDisabled
      placeholder="Select one"
      style={{ width: "256px" }}
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
  )
}
