import {
  Autocomplete,
  Avatar,
  AvatarFallback,
  AvatarImage,
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

export function UserSelectionMultiple() {
  const users = [
    {
      avatarUrl:
        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
      email: "bob@heroui.com",
      fallback: "B",
      id: "1",
      name: "Bob"
    },
    {
      avatarUrl:
        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
      email: "fred@heroui.com",
      fallback: "F",
      id: "2",
      name: "Fred"
    },
    {
      avatarUrl:
        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
      email: "martha@heroui.com",
      fallback: "M",
      id: "3",
      name: "Martha"
    },
    {
      avatarUrl:
        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
      email: "john@heroui.com",
      fallback: "J",
      id: "4",
      name: "John"
    },
    {
      avatarUrl:
        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
      email: "jane@heroui.com",
      fallback: "J",
      id: "5",
      name: "Jane"
    }
  ]

  const [selectedKeys, setSelectedKeys] = createSignal<string[]>([])
  const { contains } = useFilter({ sensitivity: "base" })

  const onRemoveTags = (keys: Set<string>) => {
    setSelectedKeys((prev) => prev.filter((key) => !keys.has(key)))
  }

  return (
    <Autocomplete
      class="w-[256px]"
      defaultValue={["1", "2"]}
      placeholder="Select your teammates"
      selectionMode="multiple"
      value={selectedKeys()}
      onChange={(keys) => setSelectedKeys(keys as string[])}
    >
      <Label>Users</Label>
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
                      const selectedItem = users.find(
                        (user) => user.id === selectedItemKey
                      )

                      if (!selectedItem) {
                        return null
                      }

                      return (
                        <Tag id={selectedItem.id}>
                          <Avatar class="size-4" size="sm">
                            <AvatarImage src={selectedItem.avatarUrl} />
                            <AvatarFallback>
                              {selectedItem.fallback}
                            </AvatarFallback>
                          </Avatar>
                          <span>{selectedItem.name}</span>
                        </Tag>
                      )
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
              <SearchField.Input placeholder="Search users..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox
            renderEmptyState={() => <EmptyState>No results found</EmptyState>}
          >
            <For each={users}>
              {(user) => (
                <ListBox.Item id={user.id} textValue={user.name}>
                  <Avatar size="sm">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.fallback}</AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col">
                    <Label>{user.name}</Label>
                    <Description>{user.email}</Description>
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
