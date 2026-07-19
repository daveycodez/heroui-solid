import {
  Autocomplete,
  EmptyState,
  Header,
  Label,
  ListBox,
  SearchField,
  Separator,
  useFilter
} from "heroui-solid"
import { createSignal } from "solid-js"

export function WithSections() {
  const [selectedKey, setSelectedKey] = createSignal<string | null>(null)
  const { contains } = useFilter({ sensitivity: "base" })

  return (
    <Autocomplete
      class="w-[256px]"
      placeholder="Select a country"
      selectionMode="single"
      value={selectedKey()}
      onChange={(key) => setSelectedKey(key as string | null)}
    >
      <Label>Country</Label>
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
            <ListBox.Section>
              <Header>North America</Header>
              <ListBox.Item id="usa" textValue="United States">
                United States
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="canada" textValue="Canada">
                Canada
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="mexico" textValue="Mexico">
                Mexico
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox.Section>
            <Separator />
            <ListBox.Section>
              <Header>Europe</Header>
              <ListBox.Item id="uk" textValue="United Kingdom">
                United Kingdom
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="france" textValue="France">
                France
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="germany" textValue="Germany">
                Germany
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="spain" textValue="Spain">
                Spain
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="italy" textValue="Italy">
                Italy
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox.Section>
            <Separator />
            <ListBox.Section>
              <Header>Asia</Header>
              <ListBox.Item id="japan" textValue="Japan">
                Japan
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="china" textValue="China">
                China
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="india" textValue="India">
                India
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="south-korea" textValue="South Korea">
                South Korea
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox.Section>
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  )
}
