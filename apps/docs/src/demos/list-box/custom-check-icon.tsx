import { Check } from "gravity-icons-solid"
import { Description, Label, ListBox, Surface } from "heroui-solid"
import { For } from "solid-js"

const users = [
  { id: "1", name: "Bob", email: "bob@heroui.com" },
  { id: "2", name: "Fred", email: "fred@heroui.com" },
  { id: "3", name: "Martha", email: "martha@heroui.com" }
]

export function CustomCheckIcon() {
  return (
    <Surface
      style={{
        width: "256px",
        "border-radius": "1.5rem",
        padding: "0.5rem"
      }}
    >
      <ListBox aria-label="Users" selectionMode="multiple">
        <For each={users}>
          {(user) => (
            <ListBox.Item id={user.id} textValue={user.name}>
              <div style={{ display: "flex", "flex-direction": "column" }}>
                <Label>{user.name}</Label>
                <Description>{user.email}</Description>
              </div>
              <ListBox.ItemIndicator>
                <Check style={{ width: "1rem", height: "1rem" }} />
              </ListBox.ItemIndicator>
            </ListBox.Item>
          )}
        </For>
      </ListBox>
    </Surface>
  )
}
