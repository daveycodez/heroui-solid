import { Eye, EyeSlash } from "gravity-icons-solid"
import { Button, Input, InputGroup, Label, TextField } from "heroui-solid"
import { createSignal } from "solid-js"

export function PasswordWithToggle() {
  const [isVisible, setIsVisible] = createSignal(false)

  return (
    <TextField
      class="w-full max-w-[280px]"
      name="password"
      value={isVisible() ? "87$2h.3diua" : "••••••••"}
    >
      <Label>Password</Label>
      <InputGroup>
        <Input
          class="w-full max-w-[280px]"
          type={isVisible() ? "text" : "password"}
        />
        <InputGroup.Suffix class="pr-0">
          <Button
            isIconOnly
            aria-label={isVisible() ? "Hide password" : "Show password"}
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(!isVisible())}
          >
            {isVisible() ? <Eye class="size-4" /> : <EyeSlash class="size-4" />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
