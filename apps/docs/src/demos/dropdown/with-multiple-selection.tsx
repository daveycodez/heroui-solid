import { Check } from "gravity-icons-solid"
import { Dropdown, Label } from "heroui-solid"
import { createSignal, For } from "solid-js"

const FRUITS = ["apple", "banana", "cherry", "orange", "pear"]

export function WithMultipleSelection() {
  const [selected, setSelected] = createSignal(new Set(["apple"]))

  const toggle = (key: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(key)
      } else {
        next.delete(key)
      }
      return next
    })
  }

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Preferred Fruits
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover class="min-w-[256px]">
          <Dropdown.Menu>
            <Dropdown.Group>
              <Dropdown.GroupLabel>Select a fruit</Dropdown.GroupLabel>
              <For each={FRUITS}>
                {(fruit) => (
                  <Dropdown.CheckboxItem
                    checked={selected().has(fruit)}
                    onChange={(checked) => toggle(fruit, checked)}
                  >
                    <Dropdown.ItemIndicator>
                      <Check class="size-4" />
                    </Dropdown.ItemIndicator>
                    <Label class="capitalize">{fruit}</Label>
                  </Dropdown.CheckboxItem>
                )}
              </For>
            </Dropdown.Group>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
