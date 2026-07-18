import { Description, Label, SearchField } from "heroui-solid"

export function Disabled() {
  return (
    <div class="flex flex-col gap-4">
      <SearchField isDisabled name="search" value="Disabled search">
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>This search field is disabled</Description>
      </SearchField>
      <SearchField isDisabled name="search-empty">
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>This search field is disabled</Description>
      </SearchField>
    </div>
  )
}
