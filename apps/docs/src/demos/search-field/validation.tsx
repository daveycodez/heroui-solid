import { FieldError, Label, SearchField } from "heroui-solid"

export function Validation() {
  return (
    <div class="flex flex-col gap-4">
      <SearchField
        required
        defaultValue="ab"
        name="search"
        validationState="invalid"
      >
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <FieldError>Search query must be at least 3 characters</FieldError>
      </SearchField>
      <SearchField
        defaultValue="invalid@query"
        name="search-invalid"
        validationState="invalid"
      >
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <FieldError>Invalid characters in search query</FieldError>
      </SearchField>
    </div>
  )
}
