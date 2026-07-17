import { buttonVariants, Description, Dropdown, Label } from "heroui-solid"
import FloppyDisk from "~icons/gravity-ui/floppy-disk"
import FolderOpen from "~icons/gravity-ui/folder-open"
import SquarePlus from "~icons/gravity-ui/square-plus"

const iconWrapStyle = {
  display: "flex",
  height: "2rem",
  "align-items": "flex-start",
  "justify-content": "center",
  "padding-top": "1px"
} as const

const iconStyle = {
  width: "1rem",
  height: "1rem",
  "flex-shrink": "0",
  color: "var(--muted)"
} as const

const textStyle = { display: "flex", "flex-direction": "column" } as const

export function WithDescriptions() {
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
            <div style={iconWrapStyle}>
              <SquarePlus style={iconStyle} />
            </div>
            <div style={textStyle}>
              <Label>New file</Label>
              <Description>Create a new file</Description>
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="open-file" textValue="Open file">
            <div style={iconWrapStyle}>
              <FolderOpen style={iconStyle} />
            </div>
            <div style={textStyle}>
              <Label>Open file</Label>
              <Description>Open an existing file</Description>
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="save-file" textValue="Save file">
            <div style={iconWrapStyle}>
              <FloppyDisk style={iconStyle} />
            </div>
            <div style={textStyle}>
              <Label>Save file</Label>
              <Description>Save the current file</Description>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
