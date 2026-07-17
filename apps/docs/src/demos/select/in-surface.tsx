import { Description, Label, ListBox, Select, Surface } from "heroui-solid"
import { For } from "solid-js"

const states = [
  { id: "florida", name: "Florida" },
  { id: "delaware", name: "Delaware" },
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" }
]

export function SelectInSurface() {
  return (
    <Surface
      style={{
        display: "flex",
        width: "320px",
        "flex-direction": "column",
        gap: "1rem",
        "border-radius": "1.5rem",
        padding: "1.5rem"
      }}
    >
      <Select fullWidth placeholder="Select one" variant="secondary">
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
        <Description>Lower emphasis for surface backgrounds</Description>
      </Select>
    </Surface>
  )
}
