import { ArrowRightFromSquare, Gear, Persons } from "gravity-icons-solid"
import { Avatar, Dropdown, Label } from "heroui-solid"

export function CustomTrigger() {
  return (
    <Dropdown>
      <Dropdown.Trigger class="rounded-full">
        <Avatar>
          <Avatar.Image
            alt="Junior Garcia"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
          />
          <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div class="px-3 pt-3 pb-1">
          <div class="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
                alt="Jane"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
              />
              <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
            </Avatar>
            <div class="flex flex-col gap-0">
              <p class="text-sm leading-5 font-medium">Jane Doe</p>
              <p class="text-xs leading-none text-muted">jane@example.com</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item id="dashboard" textValue="Dashboard">
            <Label>Dashboard</Label>
          </Dropdown.Item>
          <Dropdown.Item id="profile" textValue="Profile">
            <Label>Profile</Label>
          </Dropdown.Item>
          <Dropdown.Item id="settings" textValue="Settings">
            <div class="flex w-full items-center justify-between gap-2">
              <Label>Settings</Label>
              <Gear class="size-3.5 text-muted" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="new-project" textValue="New project">
            <div class="flex w-full items-center justify-between gap-2">
              <Label>Create Team</Label>
              <Persons class="size-3.5 text-muted" />
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="logout" textValue="Logout" variant="danger">
            <div class="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              <ArrowRightFromSquare class="size-3.5 text-danger" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
