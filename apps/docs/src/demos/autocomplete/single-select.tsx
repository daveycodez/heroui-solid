import {
  Autocomplete,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

export function SingleSelect() {
  const { contains } = useFilter({ sensitivity: "base" })

  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)

  const items = [
    { id: "cat", name: "Cat" },
    { id: "dog", name: "Dog" },
    { id: "elephant", name: "Elephant" },
    { id: "lion", name: "Lion" },
    { id: "tiger", name: "Tiger" },
    { id: "giraffe", name: "Giraffe" }
  ]

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Select an animal"
      selectionMode="single"
      value={selectedKey()}
      onChange={(key) => setSelectedKey(key as string | null)}
    >
      <Label>Favorite Animal</Label>
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
              <SearchField.Input placeholder="Search animals..." />
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
    </Autocomplete>
  )
}
