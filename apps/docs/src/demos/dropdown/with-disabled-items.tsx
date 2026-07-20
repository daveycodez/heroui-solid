import { Bars, Pencil, SquarePlus, TrashBin } from "gravity-icons-solid"
import { Description, Dropdown, Kbd, Label, Separator } from "heroui-solid"

export function WithDisabledItems() {
  return (
    <Dropdown>
      <Dropdown.Trigger isIconOnly aria-label="Menu" variant="secondary">
        <Bars class="outline-none" />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content class="min-w-[220px]">
          <Dropdown.Group>
            <Dropdown.GroupLabel>Actions</Dropdown.GroupLabel>
            <Dropdown.Item textValue="New file">
              <div class="flex h-8 items-start justify-center pt-px">
                <SquarePlus class="size-4 shrink-0 text-muted" />
              </div>
              <div class="flex flex-col">
                <Label>New file</Label>
                <Description>Create a new file</Description>
              </div>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>N</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Edit file">
              <div class="flex h-8 items-start justify-center pt-px">
                <Pencil class="size-4 shrink-0 text-muted" />
              </div>
              <div class="flex flex-col">
                <Label>Edit file</Label>
                <Description>Make changes</Description>
              </div>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>E</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
          </Dropdown.Group>
          <Separator />
          <Dropdown.Group>
            <Dropdown.GroupLabel>Danger zone</Dropdown.GroupLabel>
            <Dropdown.Item disabled textValue="Delete file" variant="danger">
              <div class="flex h-8 items-start justify-center pt-px">
                <TrashBin class="size-4 shrink-0 text-danger" />
              </div>
              <div class="flex flex-col">
                <Label>Delete file</Label>
                <Description>Move to trash</Description>
              </div>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Abbr keyValue="shift" />
                <Kbd.Content>D</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  )
}
