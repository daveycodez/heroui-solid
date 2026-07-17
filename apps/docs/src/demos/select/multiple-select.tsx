import { Label, ListBox, Select } from "heroui-solid"
import { For } from "solid-js"

const countries = [
  { id: "argentina", name: "Argentina" },
  { id: "venezuela", name: "Venezuela" },
  { id: "japan", name: "Japan" },
  { id: "france", name: "France" },
  { id: "italy", name: "Italy" },
  { id: "spain", name: "Spain" },
  { id: "thailand", name: "Thailand" },
  { id: "new-zealand", name: "New Zealand" },
  { id: "iceland", name: "Iceland" }
]

export function MultipleSelect() {
  return (
    <Select
      placeholder="Select countries"
      selectionMode="multiple"
      style={{ width: "256px" }}
    >
      <Label>Countries to Visit</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <For each={countries}>
            {(country) => (
              <ListBox.Item id={country.id} textValue={country.name}>
                {country.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </For>
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
