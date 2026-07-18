import { Button, Dropdown, Label, type Selection } from "heroui-solid"
import { createSignal } from "solid-js"

export function Controlled() {
  const [selected, setSelected] = createSignal<Selection>(new Set(["bold"]))

  const selectedItems = () => Array.from(selected())

  return (
    <div class="flex min-w-sm flex-col items-center justify-center gap-4">
      <p class="text-sm text-muted">
        Selected:{" "}
        {selectedItems().length > 0 ? selectedItems().join(", ") : "None"}
      </p>
      <Dropdown>
        <Button aria-label="Menu" variant="secondary">
          Actions
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
            selectedKeys={selected()}
            selectionMode="multiple"
            onSelectionChange={setSelected}
          >
            <Dropdown.Item id="bold" textValue="Bold">
              <Label>Bold</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
            <Dropdown.Item id="italic" textValue="Italic">
              <Label>Italic</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
            <Dropdown.Item id="underline" textValue="Underline">
              <Label>Underline</Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  )
}
