import { ChevronsExpandVertical } from "gravity-icons-solid"
import { Label, ListBox, Select } from "heroui-solid"
import { For } from "solid-js"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" }
]

export function CustomIndicator() {
  return (
    <Select placeholder="Select one" style={{ width: "256px" }}>
      <Label>State</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator style={{ width: "0.75rem", height: "0.75rem" }}>
          <ChevronsExpandVertical />
        </Select.Indicator>
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
