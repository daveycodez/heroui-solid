import { Label, SearchField } from "heroui-solid"

export function Variants() {
  return (
    <div class="flex flex-col gap-4">
      <SearchField name="primary-search" variant="primary">
        <Label>Primary variant</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <SearchField name="secondary-search" variant="secondary">
        <Label>Secondary variant</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </div>
  )
}
