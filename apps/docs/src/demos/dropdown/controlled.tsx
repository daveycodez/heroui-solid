import { Check } from "gravity-icons-solid"
import { Dropdown, Label } from "heroui-solid"
import { createSignal, For } from "solid-js"

const STYLES = ["bold", "italic", "underline"]

export function Controlled() {
  const [selected, setSelected] = createSignal(new Set(["bold"]))

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

  const selectedItems = () => Array.from(selected())

  return (
    <div class="flex min-w-sm flex-col items-center justify-center gap-4">
      <p class="text-sm text-muted">
        Selected:{" "}
        {selectedItems().length > 0 ? selectedItems().join(", ") : "None"}
      </p>
      <Dropdown>
        <Dropdown.Trigger aria-label="Menu" variant="secondary">
          Actions
        </Dropdown.Trigger>
        <Dropdown.Portal>
          <Dropdown.Content>
            <For each={STYLES}>
              {(style) => (
                <Dropdown.CheckboxItem
                  checked={selected().has(style)}
                  closeOnSelect={false}
                  onChange={(checked) => toggle(style, checked)}
                >
                  <Label class="capitalize">{style}</Label>
                  <Dropdown.ItemIndicator>
                    <Check class="size-4" />
                  </Dropdown.ItemIndicator>
                </Dropdown.CheckboxItem>
              )}
            </For>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown>
    </div>
  )
}
