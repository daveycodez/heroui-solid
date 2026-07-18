import {
  FloppyDisk,
  FolderOpen,
  SquarePlus,
  TrashBin
} from "gravity-icons-solid"
import { Button, Dropdown, Kbd, Label } from "heroui-solid"

export function WithIcons() {
  return (
    <Dropdown>
      <Button aria-label="Menu" variant="secondary">
        Actions
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="new-file" textValue="New file">
            <SquarePlus class="size-4 shrink-0 text-muted" />
            <Label>New file</Label>
            <Kbd class="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>N</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
          <Dropdown.Item id="open-file" textValue="Open file">
            <FolderOpen class="size-4 shrink-0 text-muted" />
            <Label>Open file</Label>
            <Kbd class="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>O</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
          <Dropdown.Item id="save-file" textValue="Save file">
            <FloppyDisk class="size-4 shrink-0 text-muted" />
            <Label>Save file</Label>
            <Kbd class="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>S</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
          <Dropdown.Item
            id="delete-file"
            textValue="Delete file"
            variant="danger"
          >
            <TrashBin class="size-4 shrink-0 text-danger" />
            <Label>Delete file</Label>
            <Kbd class="ms-auto" slot="keyboard" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Abbr keyValue="shift" />
              <Kbd.Content>D</Kbd.Content>
            </Kbd>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
