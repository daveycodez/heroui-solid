import { Dropdown, Label } from "heroui-solid"
import { createSignal } from "solid-js"

const CustomCheckmarkIcon = () => (
  <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="text-accent-soft-foreground"
      clip-rule="evenodd"
      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.1-8.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

export function SingleWithCustomIndicator() {
  const [selected, setSelected] = createSignal("apple")

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Fruits
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover class="min-w-[256px]">
          <Dropdown.Menu>
            <Dropdown.RadioGroup value={selected()} onChange={setSelected}>
              <Dropdown.Group>
                <Dropdown.GroupLabel>Select a fruit</Dropdown.GroupLabel>
                <Dropdown.RadioItem closeOnSelect value="apple">
                  <Dropdown.ItemIndicator>
                    <CustomCheckmarkIcon />
                  </Dropdown.ItemIndicator>
                  <Label>Apple</Label>
                </Dropdown.RadioItem>
                <Dropdown.RadioItem closeOnSelect value="banana">
                  <Dropdown.ItemIndicator>
                    <CustomCheckmarkIcon />
                  </Dropdown.ItemIndicator>
                  <Label>Banana</Label>
                </Dropdown.RadioItem>
                <Dropdown.RadioItem closeOnSelect value="cherry">
                  <Dropdown.ItemIndicator>
                    <CustomCheckmarkIcon />
                  </Dropdown.ItemIndicator>
                  <Label>Cherry</Label>
                </Dropdown.RadioItem>
              </Dropdown.Group>
              <Dropdown.RadioItem closeOnSelect value="orange">
                <Dropdown.ItemIndicator>
                  <CustomCheckmarkIcon />
                </Dropdown.ItemIndicator>
                <Label>Orange</Label>
              </Dropdown.RadioItem>
              <Dropdown.RadioItem closeOnSelect value="pear">
                <Dropdown.ItemIndicator>
                  <CustomCheckmarkIcon />
                </Dropdown.ItemIndicator>
                <Label>Pear</Label>
              </Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
