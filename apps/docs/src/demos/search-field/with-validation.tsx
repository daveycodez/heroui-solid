import { Description, FieldError, Label, SearchField } from "heroui-solid"
import { createSignal, Show } from "solid-js"

export function WithValidation() {
  const [value, setValue] = createSignal("")
  const isInvalid = () => value().length > 0 && value().length < 3

  return (
    <div class="flex flex-col gap-4">
      <SearchField
        required
        name="search"
        validationState={isInvalid() ? "invalid" : undefined}
        value={value()}
        onChange={setValue}
      >
        <Label>Search</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-[280px]" placeholder="Search..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Show
          when={isInvalid()}
          fallback={
            <Description>Enter at least 3 characters to search</Description>
          }
        >
          <FieldError>Search query must be at least 3 characters</FieldError>
        </Show>
      </SearchField>
    </div>
  )
}
