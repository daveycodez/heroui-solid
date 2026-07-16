import { Description, TextArea } from "heroui-solid"
import { createSignal } from "solid-js"

export function TextAreaControlled() {
  const [value, setValue] = createSignal("")

  return (
    <div
      style={{
        display: "flex",
        width: "24rem",
        "max-width": "100%",
        "flex-direction": "column",
        gap: "0.5rem"
      }}
    >
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
