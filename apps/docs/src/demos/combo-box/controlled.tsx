import { ComboBox, Input, Label, ListBox } from "heroui-solid"
import { createSignal, For } from "solid-js"

export function Controlled() {
  const animals = [
    {
      id: "cat",
      name: "Cat"
    },
    {
      id: "dog",
      name: "Dog"
    },
    {
      id: "bird",
      name: "Bird"
    },
    {
      id: "fish",
      name: "Fish"
    },
    {
      id: "hamster",
      name: "Hamster"
    }
  ]

  const [selectedKey, setSelectedKey] = createSignal<string | null>("cat")

  const selectedAnimal = () => animals.find((a) => a.id === selectedKey())

  return (
    <div class="space-y-2">
      <ComboBox
        class="w-[256px]"
        selectedKey={selectedKey()}
        onSelectionChange={(key) => setSelectedKey(key)}
      >
        <Label>Animal (controlled)</Label>
        <ComboBox.InputGroup>
          <Input placeholder="Search animals..." />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
          <ListBox>
            <For each={animals}>
              {(animal) => (
                <ListBox.Item id={animal.id} textValue={animal.name}>
                  {animal.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
      <p class="text-sm text-muted">
        Selected: {selectedAnimal()?.name || "None"}
      </p>
    </div>
  )
}
