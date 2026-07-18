import { Input } from "heroui-solid"

export function Variants() {
  return (
    <div class="flex w-[240px] flex-col gap-2">
      <Input fullWidth placeholder="Primary input" variant="primary" />
      <Input fullWidth placeholder="Secondary input" variant="secondary" />
    </div>
  )
}
