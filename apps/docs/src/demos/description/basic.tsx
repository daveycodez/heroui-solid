import { Description, Input, Label } from "heroui-solid"

export function DescriptionBasic() {
  return (
    <div class="flex flex-col gap-1">
      <Label for="email">Email</Label>
      <Input
        aria-describedby="email-description"
        class="w-64"
        id="email"
        placeholder="you@example.com"
        type="email"
      />
      <Description id="email-description">
        We'll never share your email with anyone else.
      </Description>
    </div>
  )
}
