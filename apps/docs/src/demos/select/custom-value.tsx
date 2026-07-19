import { Avatar, Description, Label, ListBox, Select } from "heroui-solid"
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

export function CustomValue() {
  return (
    <Select class="w-[256px]" placeholder="Select a user">
      <Label>User</Label>
      <Select.Trigger>
        <Select.Value>
          {(state) => {
            const selectedOptions = state.selectedOptions()

            if (selectedOptions.length === 0) {
              return undefined
            }

            if (selectedOptions.length > 1) {
              return `${selectedOptions.length} users selected`
            }

            const selectedItem = users.find(
              (user) => user.id === selectedOptions[0]?.id
            )

            if (!selectedItem) {
              return undefined
            }

            return (
              <div class="flex items-center gap-2">
                <Avatar class="size-4" size="sm">
                  <Avatar.Image src={selectedItem.avatarUrl} />
                  <Avatar.Fallback>{selectedItem.fallback}</Avatar.Fallback>
                </Avatar>
                <span>{selectedItem.name}</span>
              </div>
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
                  <Avatar.Image src={user.avatarUrl} />
                  <Avatar.Fallback>{user.fallback}</Avatar.Fallback>
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
