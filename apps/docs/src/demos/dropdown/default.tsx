import { Dropdown, Label } from "heroui-solid"

export function Default() {
  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Actions
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item
              textValue="New file"
              onSelect={() => console.log("Selected: new-file")}
            >
              <Label>New file</Label>
            </Dropdown.Item>
            <Dropdown.Item
              textValue="Copy link"
              onSelect={() => console.log("Selected: copy-link")}
            >
              <Label>Copy link</Label>
            </Dropdown.Item>
            <Dropdown.Item
              textValue="Edit file"
              onSelect={() => console.log("Selected: edit-file")}
            >
              <Label>Edit file</Label>
            </Dropdown.Item>
            <Dropdown.Item
              textValue="Delete file"
              variant="danger"
              onSelect={() => console.log("Selected: delete-file")}
            >
              <Label>Delete file</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
