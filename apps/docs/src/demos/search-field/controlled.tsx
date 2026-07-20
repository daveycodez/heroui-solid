import { Button, Description, Label, SearchField } from "heroui-solid"
import { createSignal } from "solid-js"

export function Controlled() {
  const [value, setValue] = createSignal("")

  return (
    <div class="flex flex-col gap-4">
      <SearchField name="search" value={value()} onChange={setValue}>
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>Current value: {value() || "(empty)"}</Description>
      </SearchField>
      <div class="flex gap-2">
        <Button variant="tertiary" onClick={() => setValue("")}>
          Clear
        </Button>
        <Button variant="tertiary" onClick={() => setValue("example query")}>
          Set example
        </Button>
      </div>
    </div>
  )
}
