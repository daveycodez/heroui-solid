import { Label, ListBox, Select } from "heroui-solid"
import { createSignal, For } from "solid-js"

const states = [
  { id: "california", name: "California" },
  { id: "texas", name: "Texas" },
  { id: "florida", name: "Florida" },
  { id: "new-york", name: "New York" },
  { id: "illinois", name: "Illinois" },
  { id: "pennsylvania", name: "Pennsylvania" }
]

export function SelectControlled() {
  const [state, setState] = createSignal<string | null>("california")
  const selectedState = () => states.find((s) => s.id === state())

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
      <Select
        placeholder="Select a state"
        style={{ width: "256px" }}
        value={state()}
        onChange={(value) => setState(value as string | null)}
      >
        <Label>State (controlled)</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <For each={states}>
              {(s) => (
                <ListBox.Item id={s.id} textValue={s.name}>
                  {s.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </Select.Popover>
      </Select>
      <p style={{ "font-size": "0.875rem", color: "var(--muted)" }}>
        Selected: {selectedState()?.name || "None"}
      </p>
    </div>
  )
}
