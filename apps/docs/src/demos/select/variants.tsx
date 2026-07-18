import { Label, ListBox, Select } from "heroui-solid"
import { For } from "solid-js"

const options = [
  { id: "option1", name: "Option 1" },
  { id: "option2", name: "Option 2" }
]

export function Variants() {
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
      <Select
        placeholder="Select one"
        style={{ width: "256px" }}
        variant="primary"
      >
        <Label>Primary variant</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <For each={options}>
              {(option) => (
                <ListBox.Item id={option.id} textValue={option.name}>
                  {option.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </Select.Popover>
      </Select>
      <Select
        placeholder="Select one"
        style={{ width: "256px" }}
        variant="secondary"
      >
        <Label>Secondary variant</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <For each={options}>
              {(option) => (
                <ListBox.Item id={option.id} textValue={option.name}>
                  {option.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  )
}
