import { buttonVariants, Dropdown, Label } from "heroui-solid"
import { createSignal } from "solid-js"

export function ControlledOpenState() {
  const [open, setOpen] = createSignal(false)

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        "justify-content": "center",
        gap: "1rem"
      }}
    >
      <p style={{ "font-size": "0.875rem", color: "var(--muted)" }}>
        Dropdown is: <strong>{open() ? "open" : "closed"}</strong>
      </p>
      <Dropdown isOpen={open()} onOpenChange={setOpen}>
        <Dropdown.Trigger
          aria-label="Menu"
          class={buttonVariants({ variant: "secondary" })}
        >
          Actions
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item id="new-file" textValue="New file">
              <Label>New file</Label>
            </Dropdown.Item>
            <Dropdown.Item id="open-file" textValue="Open file">
              <Label>Open file</Label>
            </Dropdown.Item>
            <Dropdown.Item id="save-file" textValue="Save file">
              <Label>Save file</Label>
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
    </div>
  )
}
