import { Separator } from "heroui-solid"

export function Vertical() {
  return (
    <div class="text-small flex h-5 items-center space-x-4">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  )
}
