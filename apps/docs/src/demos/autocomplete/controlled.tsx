import {
  Autocomplete,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

export function Controlled() {
  const states = [
    { id: "california", name: "California" },
    { id: "texas", name: "Texas" },
    { id: "florida", name: "Florida" },
    { id: "new-york", name: "New York" },
    { id: "illinois", name: "Illinois" },
    { id: "pennsylvania", name: "Pennsylvania" }
  ]

  const [state, setState] = createSignal<string | null>("california")
  const { contains } = useFilter({ sensitivity: "base" })

  const selectedState = () => states.find((s) => s.id === state())

  return (
    <div class="space-y-2">
      <Autocomplete
        class="w-[256px]"
        placeholder="Select a state"
        selectionMode="single"
        value={state()}
        onChange={(key) => setState(key as string | null)}
      >
        <Label>State (controlled)</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter filter={contains}>
            <SearchField autoFocus name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search states..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox
              renderEmptyState={() => <EmptyState>No results found</EmptyState>}
            >
              <For each={states}>
                {(state) => (
                  <ListBox.Item id={state.id} textValue={state.name}>
                    {state.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                )}
              </For>
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
      <p class="text-sm text-muted">
        Selected: {selectedState()?.name || "None"}
      </p>
    </div>
  )
}
