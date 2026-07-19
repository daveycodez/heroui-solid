import {
  Autocomplete,
  Description,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  Tag,
  TagGroup,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

export function EmailRecipients() {
  const emails = [
    {
      email: "alice@example.com",
      id: "alice@example.com",
      name: "Alice Johnson"
    },
    { email: "bob@example.com", id: "bob@example.com", name: "Bob Smith" },
    {
      email: "charlie@example.com",
      id: "charlie@example.com",
      name: "Charlie Brown"
    },
    {
      email: "diana@example.com",
      id: "diana@example.com",
      name: "Diana Prince"
    },
    { email: "eve@example.com", id: "eve@example.com", name: "Eve Wilson" }
  ]

  const [selectedKeys, setSelectedKeys] = createSignal<string[]>([])
  const { contains } = useFilter({ sensitivity: "base" })

  const onRemoveTags = (keys: Set<string>) => {
    setSelectedKeys((prev) => prev.filter((key) => !keys.has(key)))
  }

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Add recipients"
      selectionMode="multiple"
      value={selectedKeys()}
      onChange={(keys) => setSelectedKeys(keys as string[])}
    >
      <Label>To</Label>
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
                      const email = emails.find((e) => e.id === selectedItemKey)

                      if (!email) return null

                      return <Tag id={email.id}>{email.email}</Tag>
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
              <SearchField.Input placeholder="Search emails..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox
            renderEmptyState={() => (
              <EmptyState>No recipients found</EmptyState>
            )}
          >
            <For each={emails}>
              {(email) => (
                <ListBox.Item id={email.id} textValue={email.email}>
                  <div class="flex flex-col">
                    <Label>{email.name}</Label>
                    <Description>{email.email}</Description>
                  </div>
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
