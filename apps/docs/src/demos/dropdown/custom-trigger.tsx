import { ArrowRightFromSquare, Gear, Persons } from "gravity-icons-solid"
import { Avatar, Dropdown, Label } from "heroui-solid"

export function CustomTrigger() {
  return (
    <Dropdown>
      <Dropdown.Trigger as="button" class="rounded-full">
        <Avatar>
          <Avatar.Image
            alt="Jane Doe"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
          />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <div class="px-3 pt-3 pb-1">
            <div class="flex items-center gap-2">
              <Avatar size="sm">
                <Avatar.Image
                  alt="Jane"
                  src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
                />
                <Avatar.Fallback>JD</Avatar.Fallback>
              </Avatar>
              <div class="flex flex-col gap-0">
                <p class="text-sm leading-5 font-medium">Jane Doe</p>
                <p class="text-xs leading-none text-muted">jane@example.com</p>
              </div>
            </div>
          </div>
          <Dropdown.Item textValue="Dashboard">
            <Label>Dashboard</Label>
          </Dropdown.Item>
          <Dropdown.Item textValue="Profile">
            <Label>Profile</Label>
          </Dropdown.Item>
          <Dropdown.Item textValue="Settings">
            <Label>Settings</Label>
            <Gear class="ms-auto size-3.5 text-muted" />
          </Dropdown.Item>
          <Dropdown.Item textValue="Create Team">
            <Label>Create Team</Label>
            <Persons class="ms-auto size-3.5 text-muted" />
          </Dropdown.Item>
          <Dropdown.Item textValue="Log Out" variant="danger">
            <Label>Log Out</Label>
            <ArrowRightFromSquare class="ms-auto size-3.5 text-danger" />
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  )
}
