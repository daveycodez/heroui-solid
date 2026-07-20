import { Check } from "gravity-icons-solid"
import { Dropdown, Kbd, Label, Separator } from "heroui-solid"
import { createSignal, For } from "solid-js"

export function WithSectionLevelSelection() {
  const [textStyles, setTextStyles] = createSignal(new Set(["bold", "italic"]))
  const [textAlignment, setTextAlignment] = createSignal("left")

  const toggleStyle = (key: string, checked: boolean) => {
    setTextStyles((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(key)
      } else {
        next.delete(key)
      }
      return next
    })
  }

  const styles: [string, string][] = [
    ["bold", "B"],
    ["italic", "I"],
    ["underline", "U"]
  ]
  const alignments: [string, string][] = [
    ["left", "A"],
    ["center", "H"],
    ["right", "D"]
  ]

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Styles
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover class="min-w-[256px]">
          <Dropdown.Menu>
            <Dropdown.Group>
              <Dropdown.GroupLabel>Actions</Dropdown.GroupLabel>
              <Dropdown.Item textValue="Cut">
                <Label>Cut</Label>
                <Kbd class="ms-auto" variant="light">
                  <Kbd.Abbr keyValue="command" />
                  <Kbd.Content>X</Kbd.Content>
                </Kbd>
              </Dropdown.Item>
              <Dropdown.Item textValue="Copy">
                <Label>Copy</Label>
                <Kbd class="ms-auto" variant="light">
                  <Kbd.Abbr keyValue="command" />
                  <Kbd.Content>C</Kbd.Content>
                </Kbd>
              </Dropdown.Item>
              <Dropdown.Item textValue="Paste">
                <Label>Paste</Label>
                <Kbd class="ms-auto" variant="light">
                  <Kbd.Abbr keyValue="command" />
                  <Kbd.Content>U</Kbd.Content>
                </Kbd>
              </Dropdown.Item>
            </Dropdown.Group>
            <Separator />
            <Dropdown.Group>
              <Dropdown.GroupLabel>Text Style</Dropdown.GroupLabel>
              <For each={styles}>
                {([id, key]) => (
                  <Dropdown.CheckboxItem
                    checked={textStyles().has(id)}
                    onChange={(checked) => toggleStyle(id, checked)}
                  >
                    <Dropdown.ItemIndicator>
                      <Check class="size-4" />
                    </Dropdown.ItemIndicator>
                    <Label class="capitalize">{id}</Label>
                    <Kbd class="ms-auto" variant="light">
                      <Kbd.Abbr keyValue="command" />
                      <Kbd.Content>{key}</Kbd.Content>
                    </Kbd>
                  </Dropdown.CheckboxItem>
                )}
              </For>
            </Dropdown.Group>
            <Separator />
            <Dropdown.RadioGroup
              value={textAlignment()}
              onChange={setTextAlignment}
            >
              <Dropdown.Group>
                <Dropdown.GroupLabel>Text Alignment</Dropdown.GroupLabel>
                <For each={alignments}>
                  {([id, key]) => (
                    <Dropdown.RadioItem value={id}>
                      <Dropdown.ItemIndicator>
                        <Check class="size-4" />
                      </Dropdown.ItemIndicator>
                      <Label class="capitalize">{id}</Label>
                      <Kbd class="ms-auto" variant="light">
                        <Kbd.Abbr keyValue="alt" />
                        <Kbd.Content>{key}</Kbd.Content>
                      </Kbd>
                    </Dropdown.RadioItem>
                  )}
                </For>
              </Dropdown.Group>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
