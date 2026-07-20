import { Description, Label, SearchField } from "heroui-solid"

export function Required() {
  return (
    <div class="flex flex-col gap-4">
      <SearchField required name="search">
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <SearchField required name="search-query">
        <Label>Search query</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input
            class="w-[280px]"
            placeholder="Enter search query..."
          />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>Minimum 3 characters required</Description>
      </SearchField>
    </div>
  )
}
