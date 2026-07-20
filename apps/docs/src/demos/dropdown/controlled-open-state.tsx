import { Dropdown, Label } from "heroui-solid"
import { createSignal } from "solid-js"

export function ControlledOpenState() {
  const [open, setOpen] = createSignal(false)

  return (
    <div class="flex min-w-sm flex-col items-center justify-center gap-4">
      <p class="text-sm text-muted">
        Dropdown is: <strong>{open() ? "open" : "closed"}</strong>
      </p>
      <Dropdown open={open()} onOpenChange={setOpen}>
        <Dropdown.Trigger aria-label="Menu" variant="secondary">
          Actions
        </Dropdown.Trigger>
        <Dropdown.Portal>
          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item textValue="New file">
                <Label>New file</Label>
              </Dropdown.Item>
              <Dropdown.Item textValue="Open file">
                <Label>Open file</Label>
              </Dropdown.Item>
              <Dropdown.Item textValue="Save file">
                <Label>Save file</Label>
              </Dropdown.Item>
              <Dropdown.Item textValue="Delete file" variant="danger">
                <Label>Delete file</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown.Portal>
      </Dropdown>
    </div>
  )
}
