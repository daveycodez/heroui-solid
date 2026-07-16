import { Label, ListBox, Select } from "heroui-solid"

const animals = [
  { id: "cat", name: "Cat" },
  { id: "dog", name: "Dog" },
  { id: "bird", name: "Bird" }
]

export function SelectFullWidth() {
  return (
    <div style={{ width: "400px", "max-width": "100%" }}>
      <Select fullWidth placeholder="Select one">
        <Label>Favorite Animal</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {animals.map((animal) => (
              <ListBox.Item id={animal.id} textValue={animal.name}>
                {animal.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  )
}
