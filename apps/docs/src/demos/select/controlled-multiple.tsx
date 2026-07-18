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

export function ControlledMultiple() {
  const [selected, setSelected] = createSignal<string[]>([
    "california",
    "texas"
  ])

  return (
    <div class="space-y-4">
      <Select
        class="w-[256px]"
        placeholder="Select states"
        selectionMode="multiple"
        value={selected()}
        onChange={(keys) => setSelected(keys as string[])}
      >
        <Label>States (controlled multiple)</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox selectionMode="multiple">
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
      <p class="text-sm text-muted">
        Selected: {selected().length > 0 ? selected().join(", ") : "None"}
      </p>
    </div>
  )
}
