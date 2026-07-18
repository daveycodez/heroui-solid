import { Input, Label } from "heroui-solid"

export function Types() {
  return (
    <div class="flex w-80 flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Label for="input-type-email">Email</Label>
        <Input
          id="input-type-email"
          placeholder="jane@example.com"
          type="email"
        />
      </div>
      <div class="flex flex-col gap-1">
        <Label for="input-type-number">Age</Label>
        <Input id="input-type-number" min={0} placeholder="30" type="number" />
      </div>
      <div class="flex flex-col gap-1">
        <Label for="input-type-password">Password</Label>
        <Input
          id="input-type-password"
          placeholder="••••••••"
          type="password"
        />
      </div>
    </div>
  )
}
