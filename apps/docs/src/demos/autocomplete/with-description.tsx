import {
  Autocomplete,
  Description,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

export function WithDescription() {
  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)
  const { contains } = useFilter({ sensitivity: "base" })

  const items = [
    { id: "florida", name: "Florida" },
    { id: "delaware", name: "Delaware" },
    { id: "california", name: "California" },
    { id: "texas", name: "Texas" },
    { id: "new-york", name: "New York" },
    { id: "washington", name: "Washington" }
  ]

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Select one"
      selectionMode="single"
      value={selectedKey()}
      onChange={(key) => setSelectedKey(key as string | null)}
    >
      <Label>State</Label>
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
            <For each={items}>
              {(item) => (
                <ListBox.Item id={item.id} textValue={item.name}>
                  {item.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
      <Description>Select your state of residence</Description>
    </Autocomplete>
  )
}
