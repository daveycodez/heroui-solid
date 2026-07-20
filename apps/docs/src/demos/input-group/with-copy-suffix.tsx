import { Copy } from "gravity-icons-solid"
import { Button, Input, InputGroup, Label, TextField } from "heroui-solid"

export function WithCopySuffix() {
  return (
    <TextField
      class="w-full max-w-[280px]"
      defaultValue="heroui.com"
      name="website"
    >
      <Label>Website</Label>
      <InputGroup>
        <Input class="w-full max-w-[280px]" />
        <InputGroup.Suffix class="pr-0">
          <Button isIconOnly aria-label="Copy" size="sm" variant="ghost">
            <Copy class="size-4" />
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
