import {
  Autocomplete,
  Description,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

interface City {
  name: string
  country: string
}

export function LocationSearch() {
  const allCities: City[] = [
    { country: "USA", name: "New York" },
    { country: "USA", name: "Los Angeles" },
    { country: "USA", name: "Chicago" },
    { country: "UK", name: "London" },
    { country: "France", name: "Paris" },
    { country: "Japan", name: "Tokyo" },
    { country: "Australia", name: "Sydney" },
    { country: "Canada", name: "Toronto" },
    { country: "Germany", name: "Berlin" },
    { country: "Spain", name: "Madrid" }
  ]

  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)
  const [isLoading, setIsLoading] = createSignal(false)
  const { contains } = useFilter({ sensitivity: "base" })

  // Simulate async filtering
  const customFilter = (text: string, inputValue: string) => {
    if (!inputValue) return true
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 300)

    return contains(text, inputValue)
  }

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Search for a city"
      selectionMode="single"
      value={selectedKey()}
      onChange={(key) => setSelectedKey(key as string | null)}
    >
      <Label>City</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={customFilter}>
          <SearchField autoFocus name="search" variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search cities..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox
            renderEmptyState={() => (
              <EmptyState>
                {isLoading() ? "Searching..." : "No cities found"}
              </EmptyState>
            )}
          >
            <For each={allCities}>
              {(city) => (
                <ListBox.Item id={city.name} textValue={city.name}>
                  <div class="flex flex-col">
                    <Label>{city.name}</Label>
                    <Description>{city.country}</Description>
                  </div>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
