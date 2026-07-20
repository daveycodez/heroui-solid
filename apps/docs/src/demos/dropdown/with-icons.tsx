import {
  FloppyDisk,
  FolderOpen,
  SquarePlus,
  TrashBin
} from "gravity-icons-solid"
import { Dropdown, Kbd, Label } from "heroui-solid"

export function WithIcons() {
  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Actions
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item textValue="New file">
              <SquarePlus class="size-4 shrink-0 text-muted" />
              <Label>New file</Label>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>N</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Open file">
              <FolderOpen class="size-4 shrink-0 text-muted" />
              <Label>Open file</Label>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>O</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Save file">
              <FloppyDisk class="size-4 shrink-0 text-muted" />
              <Label>Save file</Label>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>S</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Delete file" variant="danger">
              <TrashBin class="size-4 shrink-0 text-danger" />
              <Label>Delete file</Label>
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
