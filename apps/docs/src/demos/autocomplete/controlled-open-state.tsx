import {
  Autocomplete,
  Button,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  useFilter
} from "heroui-solid"
import { createSignal, For } from "solid-js"

export function ControlledOpenState() {
  const [isOpen, setIsOpen] = createSignal(false)
  const { contains } = useFilter({ sensitivity: "base" })

  const items = [
    { id: "florida", name: "Florida" },
    { id: "delaware", name: "Delaware" },
    { id: "california", name: "California" },
    { id: "texas", name: "Texas" },
    { id: "new-york", name: "New York" },
    { id: "washington", name: "Washington" }
  ]

  return (
    <div class="space-y-4">
      <Autocomplete
        class="w-[256px]"
        isOpen={isOpen()}
        placeholder="Select one"
        selectionMode="single"
        onOpenChange={setIsOpen}
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
      <Button onClick={() => setIsOpen(!isOpen())}>
        {isOpen() ? "Close" : "Open"} Autocomplete
      </Button>
      <p class="text-sm text-muted">
        Autocomplete is {isOpen() ? "open" : "closed"}
      </p>
    </div>
  )
}
