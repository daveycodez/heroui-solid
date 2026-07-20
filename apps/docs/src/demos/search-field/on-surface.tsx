import { Description, Label, SearchField, Surface } from "heroui-solid"

export function OnSurface() {
  return (
    <Surface class="flex w-full max-w-sm flex-col gap-4 rounded-3xl p-6">
      <SearchField name="search" variant="secondary">
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-full" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>Enter keywords to search</Description>
      </SearchField>
      <SearchField name="search-2" variant="secondary">
        <Label>Advanced search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-full" placeholder="Advanced search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Description>Use filters to refine your search</Description>
      </SearchField>
    </Surface>
  )
}
