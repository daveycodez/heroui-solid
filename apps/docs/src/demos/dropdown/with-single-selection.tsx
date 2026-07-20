import { Dropdown, Label } from "heroui-solid"
import { createSignal } from "solid-js"

export function WithSingleSelection() {
  const [selected, setSelected] = createSignal("apple")

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Fruit
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover class="min-w-[256px]">
          <Dropdown.Menu>
            <Dropdown.RadioGroup value={selected()} onChange={setSelected}>
              <Dropdown.Group>
                <Dropdown.GroupLabel>Select a fruit</Dropdown.GroupLabel>
                <Dropdown.RadioItem value="apple">
                  <Dropdown.ItemIndicator />
                  <Label>Apple</Label>
                </Dropdown.RadioItem>
                <Dropdown.RadioItem value="banana">
                  <Dropdown.ItemIndicator />
                  <Label>Banana</Label>
                </Dropdown.RadioItem>
                <Dropdown.RadioItem value="cherry">
                  <Dropdown.ItemIndicator />
                  <Label>Cherry</Label>
                </Dropdown.RadioItem>
              </Dropdown.Group>
              <Dropdown.RadioItem value="orange">
                <Dropdown.ItemIndicator />
                <Label>Orange</Label>
              </Dropdown.RadioItem>
              <Dropdown.RadioItem value="pear">
                <Dropdown.ItemIndicator />
                <Label>Pear</Label>
              </Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
