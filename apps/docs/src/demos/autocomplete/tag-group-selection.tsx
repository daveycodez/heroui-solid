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

export function TagGroupSelection() {
  const tags = [
    { id: "react", name: "React" },
    { id: "typescript", name: "TypeScript" },
    { id: "javascript", name: "JavaScript" },
    { id: "nodejs", name: "Node.js" },
    { id: "python", name: "Python" },
    { id: "vue", name: "Vue" },
    { id: "angular", name: "Angular" },
    { id: "nextjs", name: "Next.js" }
  ]

  const [selectedKeys, setSelectedKeys] = createSignal<string[]>([])
  const { contains } = useFilter({ sensitivity: "base" })

  const onRemoveTags = (keys: Set<string>) => {
    setSelectedKeys((prev) => prev.filter((key) => !keys.has(key)))
  }

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Select tags"
      selectionMode="multiple"
      value={selectedKeys()}
      onChange={(keys) => setSelectedKeys(keys as string[])}
    >
      <Label>Tags</Label>
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
                      const tag = tags.find((t) => t.id === selectedItemKey)

                      if (!tag) return null

                      return <Tag id={tag.id}>{tag.name}</Tag>
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
              <SearchField.Input placeholder="Search tags..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox
            renderEmptyState={() => <EmptyState>No tags found</EmptyState>}
          >
            <For each={tags}>
              {(tag) => (
                <ListBox.Item id={tag.id} textValue={tag.name}>
                  {tag.name}
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
