import { Input, Surface } from "heroui-solid"

export function OnSurface() {
  return (
    <Surface class="flex h-[180px] w-[280px] items-center justify-center rounded-3xl bg-surface p-4">
      <Input class="w-full" placeholder="Your name" variant="secondary" />
    </Surface>
  )
}
