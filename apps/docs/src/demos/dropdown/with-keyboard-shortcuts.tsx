import { Dropdown, Kbd, Label } from "heroui-solid"

export function WithKeyboardShortcuts() {
  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Actions
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item textValue="New">
              <Label>New</Label>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>N</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Open">
              <Label>Open</Label>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>O</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Save">
              <Label>Save</Label>
              <Kbd class="ms-auto" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>S</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item textValue="Delete" variant="danger">
              <Label>Delete</Label>
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
