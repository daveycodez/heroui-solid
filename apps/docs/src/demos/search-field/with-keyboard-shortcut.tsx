import { Description, Kbd, Label, SearchField } from "heroui-solid"
import { createSignal, onCleanup, onMount } from "solid-js"

export function WithKeyboardShortcut() {
  let inputRef: HTMLInputElement | undefined
  const [value, setValue] = createSignal("")

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+S focuses the field
      if (
        e.shiftKey &&
        e.key === "S" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault()
        inputRef?.focus()
      }
      // ESC blurs the input when focused
      if (e.key === "Escape" && document.activeElement === inputRef) {
        inputRef?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown))
  })

  return (
    <div class="flex flex-col gap-4">
      <div>
        <SearchField name="search" value={value()} onChange={setValue}>
          <Label>Search</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              ref={(el: HTMLInputElement) => {
                inputRef = el
              }}
              class="w-[280px]"
              placeholder="Search..."
            />
            <SearchField.ClearButton />
          </SearchField.Group>
          <Description>
            Use keyboard shortcut to quickly focus this field
          </Description>
        </SearchField>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted">
        <span>Press</span>
        <Kbd>
          <Kbd.Abbr keyValue="shift" />
          <Kbd.Content>S</Kbd.Content>
        </Kbd>
        <span>to focus the search field</span>
      </div>
    </div>
  )
}
