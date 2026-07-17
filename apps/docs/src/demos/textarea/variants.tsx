import { TextArea } from "heroui-solid"

export function TextAreaVariants() {
  return (
    <div class="flex w-[280px] flex-col gap-2">
      <TextArea fullWidth placeholder="Primary textarea" variant="primary" />
      <TextArea
        fullWidth
        placeholder="Secondary textarea"
        variant="secondary"
      />
    </div>
  )
}
