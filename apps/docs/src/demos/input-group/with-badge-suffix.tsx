import { Chip, Input, InputGroup, TextField } from "heroui-solid"

export function WithBadgeSuffix() {
  return (
    <TextField
      aria-label="Email address"
      class="w-full max-w-[280px]"
      name="email"
    >
      <InputGroup>
        <Input class="w-full max-w-[280px]" placeholder="Email address" />
        <InputGroup.Suffix class="pr-2">
          <Chip color="accent" size="md" variant="soft">
            Pro
          </Chip>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
