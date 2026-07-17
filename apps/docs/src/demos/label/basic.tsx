import { Input, Label } from "heroui-solid"

export function Basic() {
  return (
    <div class="flex flex-col gap-1">
      <Label for="name">Name</Label>
      <Input class="w-64" id="name" placeholder="Enter your name" type="text" />
    </div>
  )
}
