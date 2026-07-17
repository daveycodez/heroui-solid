import { Surface, TextArea } from "heroui-solid"

export function TextAreaInSurface() {
  return (
    <Surface class="w-full rounded-3xl p-6">
      <TextArea
        class="w-full min-w-[280px]"
        placeholder="Describe your product"
        variant="secondary"
      />
    </Surface>
  )
}
