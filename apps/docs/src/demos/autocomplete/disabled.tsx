import {
  Autocomplete,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  useFilter
} from "heroui-solid"
import { For } from "solid-js"

export function Disabled() {
  const { contains } = useFilter({ sensitivity: "base" })

  const items = [
    { id: "florida", name: "Florida" },
    { id: "delaware", name: "Delaware" },
    { id: "california", name: "California" },
    { id: "texas", name: "Texas" },
    { id: "new-york", name: "New York" },
    { id: "washington", name: "Washington" }
  ]

  const countries = [
    { id: "argentina", name: "Argentina" },
    { id: "venezuela", name: "Venezuela" },
    { id: "japan", name: "Japan" },
    { id: "france", name: "France" },
    { id: "italy", name: "Italy" },
    { id: "spain", name: "Spain" }
  ]

  return (
    <div class="flex flex-col gap-4">
      <Autocomplete
        isDisabled
        class="w-[256px]"
        defaultValue="california"
        placeholder="Select one"
        selectionMode="single"
      >
        <Label>State</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter filter={contains}>
            <SearchField autoFocus name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search states..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox
              renderEmptyState={() => <EmptyState>No results found</EmptyState>}
            >
              <For each={items}>
                {(item) => (
                  <ListBox.Item id={item.id} textValue={item.name}>
                    {item.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                )}
              </For>
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
      <Autocomplete
        isDisabled
        class="w-[256px]"
        defaultValue={["argentina", "japan", "france"]}
        placeholder="Select countries"
        selectionMode="multiple"
      >
        <Label>Countries to Visit</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter filter={contains}>
            <SearchField autoFocus name="search" variant="secondary">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search countries..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <ListBox
              renderEmptyState={() => <EmptyState>No results found</EmptyState>}
            >
              <For each={countries}>
                {(country) => (
                  <ListBox.Item id={country.id} textValue={country.name}>
                    {country.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                )}
              </For>
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
      </Autocomplete>
    </div>
  )
}
