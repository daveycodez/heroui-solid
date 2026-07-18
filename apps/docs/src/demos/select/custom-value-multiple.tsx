import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Chip,
  Description,
  Label,
  ListBox,
  Select
} from "heroui-solid"
import { For } from "solid-js"

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

export function CustomValueMultiple() {
  return (
    <Select
      class="w-[256px]"
      defaultValue={["1", "2"]}
      placeholder="Select your teammates"
      selectionMode="multiple"
    >
      <Label>Users</Label>
      <Select.Trigger>
        <Select.Value class="no-truncate flex flex-wrap gap-2">
          {(state) => {
            const selectedOptions = state.selectedOptions()

            if (selectedOptions.length === 0) {
              return undefined
            }

            return (
              <For each={selectedOptions}>
                {(option) => {
                  const selectedItem = users.find(
                    (user) => user.id === option.id
                  )

                  if (!selectedItem) {
                    return null
                  }

                  return (
                    <Chip variant="soft">
                      <Avatar class="size-4" size="sm">
                        <AvatarImage src={selectedItem.avatarUrl} />
                        <AvatarFallback>{selectedItem.fallback}</AvatarFallback>
                      </Avatar>
                      <Chip.Label>{selectedItem.name}</Chip.Label>
                    </Chip>
                  )
                }}
              </For>
            )
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
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
      </Select.Popover>
    </Select>
  )
}
