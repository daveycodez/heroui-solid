import {
  FloppyDisk,
  FolderOpen,
  SquarePlus,
  TrashBin
} from "gravity-icons-solid"
import { Description, Dropdown, Kbd, Label } from "heroui-solid"

export function WithDescriptions() {
  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Actions
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover>
          <Dropdown.Menu>
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
            <Dropdown.Item textValue="Open file">
              <div class="flex h-8 items-start justify-center pt-px">
                <FolderOpen class="size-4 shrink-0 text-muted" />
              </div>
              <div class="flex flex-col">
                <Label>Open file</Label>
                <Description>Open an existing file</Description>
              </div>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>O</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Save file">
              <div class="flex h-8 items-start justify-center pt-px">
                <FloppyDisk class="size-4 shrink-0 text-muted" />
              </div>
              <div class="flex flex-col">
                <Label>Save file</Label>
                <Description>Save the current file</Description>
              </div>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>S</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Delete file" variant="danger">
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
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
