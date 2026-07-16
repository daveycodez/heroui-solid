import { Label, TextArea } from "heroui-solid"

export function TextAreaRows() {
  return (
    <div
      style={{
        display: "flex",
        width: "24rem",
        "max-width": "100%",
        "flex-direction": "column",
        gap: "1rem"
      }}
    >
      <div
        style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}
      >
        <Label for="textarea-rows-3">Short feedback</Label>
        <TextArea
          id="textarea-rows-3"
          placeholder="This week's highlights..."
          rows={3}
        />
      </div>
      <div
        style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}
      >
        <Label for="textarea-rows-6">Detailed notes</Label>
        <TextArea
          id="textarea-rows-6"
          placeholder="Write out the full meeting notes..."
          rows={6}
          style={{ resize: "vertical" }}
        />
      </div>
    </div>
  )
}
