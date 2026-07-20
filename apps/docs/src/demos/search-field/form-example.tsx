import {
  Button,
  Description,
  FieldError,
  Form,
  Label,
  SearchField,
  Spinner
} from "heroui-solid"
import { createSignal, Show } from "solid-js"

export function FormExample() {
  const [value, setValue] = createSignal("")
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const MIN_LENGTH = 3
  const isInvalid = () => value().length > 0 && value().length < MIN_LENGTH

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()

    if (value().length < MIN_LENGTH) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setValue("")
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <Form class="flex w-[280px] flex-col gap-4" onSubmit={handleSubmit}>
      <SearchField
        required
        name="search"
        validationState={isInvalid() ? "invalid" : undefined}
        value={value()}
        onChange={setValue}
      >
        <Label>Search products</Label>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input class="w-full" placeholder="Search products..." />
          <SearchField.ClearButton />
        </SearchField.Group>
        <Show
          when={isInvalid()}
          fallback={
            <Description>
              Enter at least {MIN_LENGTH} characters to search
            </Description>
          }
        >
          <FieldError>
            Search query must be at least {MIN_LENGTH} characters
          </FieldError>
        </Show>
      </SearchField>
      <Button
        class="w-full"
        disabled={value().length < MIN_LENGTH}
        isPending={isSubmitting()}
        type="submit"
        variant="primary"
      >
        <Show when={isSubmitting()} fallback={<>Search</>}>
          <Spinner color="current" size="sm" />
          Searching...
        </Show>
      </Button>
    </Form>
  )
}
