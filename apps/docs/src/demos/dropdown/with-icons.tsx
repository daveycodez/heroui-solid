import {
  FloppyDisk,
  FolderOpen,
  SquarePlus,
  TrashBin
} from "gravity-icons-solid"
import { buttonVariants, Dropdown, Label } from "heroui-solid"

const iconStyle = {
  width: "1rem",
  height: "1rem",
  "flex-shrink": "0",
  color: "var(--muted)"
} as const

export function WithIcons() {
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
            <SquarePlus style={iconStyle} />
            <Label>New file</Label>
          </Dropdown.Item>
          <Dropdown.Item id="open-file" textValue="Open file">
            <FolderOpen style={iconStyle} />
            <Label>Open file</Label>
          </Dropdown.Item>
          <Dropdown.Item id="save-file" textValue="Save file">
            <FloppyDisk style={iconStyle} />
            <Label>Save file</Label>
          </Dropdown.Item>
          <Dropdown.Item
            id="delete-file"
            textValue="Delete file"
            variant="danger"
          >
            <TrashBin style={{ ...iconStyle, color: "var(--danger)" }} />
            <Label>Delete file</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
