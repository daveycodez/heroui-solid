import { Label, SearchField } from "heroui-solid"

// HeroUI React overrides the rendered element with a `render` prop. This port
// uses Kobalte's polymorphic `as` instead, with the injected prop passed
// directly on the same part.
export function CustomElement() {
  return (
    <SearchField as="div" data-custom="foo" name="search">
      <Label>Search</Label>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input class="w-[280px]" placeholder="Search..." />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  )
}
