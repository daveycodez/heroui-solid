import { Label, ListBox, Select } from "heroui-solid"
import { For } from "solid-js"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" },
  { id: "new-york", name: "New York" },
  { id: "washington", name: "Washington" }
]

const countries = [
  { id: "argentina", name: "Argentina" },
  { id: "venezuela", name: "Venezuela" },
  { id: "japan", name: "Japan" },
  { id: "france", name: "France" },
  { id: "italy", name: "Italy" },
  { id: "spain", name: "Spain" }
]

export function Disabled() {
  return (
    <div class="flex flex-col gap-4">
      <Select
        class="w-[256px]"
        defaultValue="california"
        isDisabled
        placeholder="Select one"
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
      <Select
        class="w-[256px]"
        defaultValue={["argentina", "japan", "france"]}
        isDisabled
        placeholder="Select countries"
        selectionMode="multiple"
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
    </div>
  )
}
