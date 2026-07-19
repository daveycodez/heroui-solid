import {
  Autocomplete,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  Tag,
  TagGroup,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

export function MultipleSelect() {
  const [selectedKeys, setSelectedKeys] = createSignal<string[]>([])
  const { contains } = useFilter({ sensitivity: "base" })

  const items = [
    { id: "california", name: "California" },
    { id: "texas", name: "Texas" },
    { id: "florida", name: "Florida" },
    { id: "new-york", name: "New York" },
    { id: "illinois", name: "Illinois" },
    { id: "pennsylvania", name: "Pennsylvania" }
  ]

  const onRemoveTags = (keys: Set<string>) => {
    setSelectedKeys((prev) => prev.filter((key) => !keys.has(key)))
  }

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Select states"
      selectionMode="multiple"
      value={selectedKeys()}
      onChange={(keys) => setSelectedKeys(keys as string[])}
    >
      <Label>States</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value>
          {({ defaultChildren, isPlaceholder, state }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren
            }

            return (
              <TagGroup size="sm" onRemove={onRemoveTags}>
                <TagGroup.List>
                  <For each={state.selectedItems.map((item) => item.key)}>
                    {(selectedItemKey) => {
                      const item = items.find((s) => s.id === selectedItemKey)

                      if (!item) return null

                      return <Tag id={item.id}>{item.name}</Tag>
                    }}
                  </For>
                </TagGroup.List>
              </TagGroup>
            )
          }}
        </Autocomplete.Value>
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField autoFocus name="search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search..." />
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
