import { Label, ListBox, Select } from "heroui-solid"
import ChevronsExpandVertical from "~icons/gravity-ui/chevrons-expand-vertical"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" }
]

export function SelectCustomIndicator() {
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
          {states.map((state) => (
            <ListBox.Item id={state.id} textValue={state.name}>
              {state.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}
