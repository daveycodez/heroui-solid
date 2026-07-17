import { buttonVariants, Dropdown, Label } from "heroui-solid"

export function Default() {
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Menu"
        class={buttonVariants({ variant: "secondary" })}
      >
        Actions
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="new-file" textValue="New file">
            <Label>New file</Label>
          </Dropdown.Item>
          <Dropdown.Item id="copy-link" textValue="Copy link">
            <Label>Copy link</Label>
          </Dropdown.Item>
          <Dropdown.Item id="edit-file" textValue="Edit file">
            <Label>Edit file</Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="delete-file"
            textValue="Delete file"
            variant="danger"
          >
            <Label>Delete file</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
