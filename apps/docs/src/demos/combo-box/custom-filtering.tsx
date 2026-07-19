import { ComboBox, Input, Label, ListBox } from "heroui-solid"
import { For } from "solid-js"

export function CustomFiltering() {
  const animals = [
    { id: "cat", name: "Cat" },
    { id: "dog", name: "Dog" },
    { id: "bird", name: "Bird" },
    { id: "fish", name: "Fish" },
    { id: "hamster", name: "Hamster" }
  ]

  return (
    <ComboBox
      class="w-[256px]"
      defaultFilter={(text, inputValue) => {
        if (!inputValue) return true

        return text.toLowerCase().includes(inputValue.toLowerCase())
      }}
    >
      <Label>Animal (custom filter)</Label>
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
  )
}
