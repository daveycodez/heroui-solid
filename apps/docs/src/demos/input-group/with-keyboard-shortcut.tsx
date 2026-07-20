import { Input, InputGroup, Kbd, TextField } from "heroui-solid"

export function WithKeyboardShortcut() {
  return (
    <TextField aria-label="Command" class="w-full max-w-[280px]" name="command">
      <InputGroup>
        <Input class="w-full max-w-[280px]" placeholder="Command" />
        <InputGroup.Suffix class="pr-2">
          <Kbd>
            <Kbd.Abbr keyValue="command" />
            <Kbd.Content>K</Kbd.Content>
          </Kbd>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
