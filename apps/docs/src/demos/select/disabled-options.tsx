import { Label, ListBox, Select } from "heroui-solid"

const animals = [
  { id: "dog", name: "Dog" },
  { id: "cat", name: "Cat" },
  { id: "bird", name: "Bird" },
  { id: "kangaroo", name: "Kangaroo" },
  { id: "elephant", name: "Elephant" },
  { id: "tiger", name: "Tiger" }
]

export function SelectDisabledOptions() {
  return (
    <Select
      disabledKeys={["cat", "kangaroo"]}
      placeholder="Select an animal"
      style={{ width: "256px" }}
    >
      <Label>Animal</Label>
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
  )
}
