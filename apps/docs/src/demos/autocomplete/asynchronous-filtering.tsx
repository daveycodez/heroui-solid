import {
  Autocomplete,
  EmptyState,
  Label,
  ListBox,
  SearchField,
  Spinner
} from "heroui-solid"
import { createEffect, createResource, createSignal, onCleanup } from "solid-js"
import { isServer } from "solid-js/web"
import { cn } from "tailwind-variants"

interface Character {
  name: string
}

export function AsynchronousFiltering() {
  const [filterText, setFilterText] = createSignal("")
  const [debouncedText, setDebouncedText] = createSignal("")

  createEffect(() => {
    const text = filterText()
    const timer = setTimeout(() => setDebouncedText(text), 300)

    onCleanup(() => clearTimeout(timer))
  })

  const [characters] = createResource(debouncedText, async (search) => {
    if (isServer) return []

    try {
      const res = await fetch(
        `https://swapi.py4e.com/api/people/?search=${search}`
      )
      const json = await res.json()

      return (json.results ?? []) as Character[]
    } catch {
      return []
    }
  })

  return (
    <Autocomplete
      allowsEmptyCollection
      class="w-[256px]"
      placeholder="Search..."
      selectionMode="single"
    >
      <Label>Search a Star Wars characters</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter
          inputValue={filterText()}
          onInputChange={setFilterText}
        >
          <SearchField
            autoFocus
            class="sticky top-0 z-10"
            name="search"
            variant="secondary"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search characters..." />
              <Spinner
                size="sm"
                class={cn("absolute top-1/2 right-2 -translate-y-1/2", {
                  "pointer-events-none opacity-0": !characters.loading
                })}
              />
              <SearchField.ClearButton
                class={cn({
                  "pointer-events-none opacity-0": !!characters.loading
                })}
              />
            </SearchField.Group>
          </SearchField>
          <ListBox
            class="max-h-[420px] overflow-y-auto"
            items={characters() ?? []}
            renderEmptyState={() => <EmptyState>No results found</EmptyState>}
          >
            {(item: Character) => (
              <ListBox.Item id={item.name} textValue={item.name}>
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
