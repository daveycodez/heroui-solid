import { TextArea } from "heroui-solid"

export function FullWidth() {
  return (
    <div class="w-[400px] space-y-3">
      <TextArea fullWidth placeholder="Full width textarea" />
    </div>
  )
}
