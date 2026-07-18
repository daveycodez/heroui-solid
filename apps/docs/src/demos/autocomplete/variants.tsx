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

export function Variants() {
  const [selectedKey1, setSelectedKey1] = createSignal<string | null>(null)
  const [selectedKey2, setSelectedKey2] = createSignal<string | null>(null)
  const [selectedKeys1, setSelectedKeys1] = createSignal<string[]>([])
  const [selectedKeys2, setSelectedKeys2] = createSignal<string[]>([])
  const { contains } = useFilter({ sensitivity: "base" })

  const items = [
    { id: "option1", name: "Option 1" },
    { id: "option2", name: "Option 2" },
    { id: "option3", name: "Option 3" },
    { id: "option4", name: "Option 4" }
  ]

  const onRemoveTags1 = (keys: Set<string>) => {
    setSelectedKeys1((prev) => prev.filter((key) => !keys.has(key)))
  }

  const onRemoveTags2 = (keys: Set<string>) => {
    setSelectedKeys2((prev) => prev.filter((key) => !keys.has(key)))
  }

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Single Select Variants</h3>
        <div class="flex flex-col gap-4">
          <Autocomplete
            class="w-[256px]"
            placeholder="Select one"
            selectionMode="single"
            value={selectedKey1()}
            variant="primary"
            onChange={(key) => setSelectedKey1(key as string | null)}
          >
            <Label>Primary variant</Label>
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
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox
                  renderEmptyState={() => (
                    <EmptyState>No results found</EmptyState>
                  )}
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
          <Autocomplete
            class="w-[256px]"
            placeholder="Select one"
            selectionMode="single"
            value={selectedKey2()}
            variant="secondary"
            onChange={(key) => setSelectedKey2(key as string | null)}
          >
            <Label>Secondary variant</Label>
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
                    <SearchField.Input placeholder="Search..." />
                    <SearchField.ClearButton />
                  </SearchField.Group>
                </SearchField>
                <ListBox
                  renderEmptyState={() => (
                    <EmptyState>No results found</EmptyState>
                  )}
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
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Multiple Select Variants</h3>
        <div class="flex flex-col gap-4">
          <Autocomplete
            class="w-[256px]"
            placeholder="Select multiple"
            selectionMode="multiple"
            value={selectedKeys1()}
            variant="primary"
            onChange={(keys) => setSelectedKeys1(keys as string[])}
          >
            <Label>Primary variant</Label>
            <Autocomplete.Trigger>
              <Autocomplete.Value>
                {({ defaultChildren, isPlaceholder, state }) => {
                  if (isPlaceholder || state.selectedItems.length === 0) {
                    return defaultChildren
                  }

                  return (
                    <TagGroup size="sm" onRemove={onRemoveTags1}>
                      <TagGroup.List>
                        <For each={state.selectedItems.map((item) => item.key)}>
                          {(selectedItemKey) => {
                            const item = items.find(
                              (s) => s.id === selectedItemKey
                            )

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
                  renderEmptyState={() => (
                    <EmptyState>No results found</EmptyState>
                  )}
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
          <Autocomplete
            class="w-[256px]"
            placeholder="Select multiple"
            selectionMode="multiple"
            value={selectedKeys2()}
            variant="secondary"
            onChange={(keys) => setSelectedKeys2(keys as string[])}
          >
            <Label>Secondary variant</Label>
            <Autocomplete.Trigger>
              <Autocomplete.Value>
                {({ defaultChildren, isPlaceholder, state }) => {
                  if (isPlaceholder || state.selectedItems.length === 0) {
                    return defaultChildren
                  }

                  return (
                    <TagGroup
                      size="sm"
                      variant="surface"
                      onRemove={onRemoveTags2}
                    >
                      <TagGroup.List>
                        <For each={state.selectedItems.map((item) => item.key)}>
                          {(selectedItemKey) => {
                            const item = items.find(
                              (s) => s.id === selectedItemKey
                            )

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
                  renderEmptyState={() => (
                    <EmptyState>No results found</EmptyState>
                  )}
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
        </div>
      </div>
    </div>
  )
}
