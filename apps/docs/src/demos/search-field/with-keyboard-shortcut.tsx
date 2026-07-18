import { Description, Kbd, Label, SearchField } from "heroui-solid"
import { createSignal, onCleanup, onMount } from "solid-js"

export function WithKeyboardShortcut() {
  let inputRef: HTMLInputElement | undefined
  const [value, setValue] = createSignal("")

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Shift+S
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
      // Check for ESC key to blur the input
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
              ref={inputRef}
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
      <div class="text-default-500 flex items-center gap-2 text-sm">
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
