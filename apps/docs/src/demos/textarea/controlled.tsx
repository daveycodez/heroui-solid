import { Description, TextArea } from "heroui-solid"
import { createSignal } from "solid-js"

export function Controlled() {
  const [value, setValue] = createSignal("")

  return (
    <div class="flex w-96 flex-col gap-2">
      <TextArea
        aria-describedby="textarea-controlled-description"
        aria-label="Announcement"
        placeholder="Compose an announcement..."
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <Description id="textarea-controlled-description">
        Characters: {value().length} / 280
      </Description>
    </div>
  )
}
