import { TextArea } from "heroui-solid"

export function AutoResize() {
  return (
    <TextArea
      autoResize
      aria-label="Release notes"
      class="w-96"
      placeholder="Type a few lines and the field grows to fit..."
      value={
        "Auto-resize expands this textarea to fit its content.\nAdd more lines and it keeps growing — no inner scrollbar."
      }
    />
  )
}
