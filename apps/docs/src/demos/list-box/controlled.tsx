import { Description, Label, ListBox, Surface } from "heroui-solid"
import { createSignal, For } from "solid-js"

const users = [
  { id: "1", name: "Bob", email: "bob@heroui.com" },
  { id: "2", name: "Fred", email: "fred@heroui.com" },
  { id: "3", name: "Martha", email: "martha@heroui.com" }
]

export function Controlled() {
  const [selected, setSelected] = createSignal<Set<string>>(new Set(["1"]))
  const selectedItems = () => [...selected()]

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
      <Surface
        style={{
          width: "256px",
          "border-radius": "1.5rem",
          padding: "0.5rem"
        }}
      >
        <ListBox
          aria-label="Users"
          selectedKeys={selected()}
          selectionMode="multiple"
          onSelectionChange={setSelected}
        >
          <For each={users}>
            {(user) => (
              <ListBox.Item id={user.id} textValue={user.name}>
                <div style={{ display: "flex", "flex-direction": "column" }}>
                  <Label>{user.name}</Label>
                  <Description>{user.email}</Description>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </For>
        </ListBox>
      </Surface>
      <p style={{ "font-size": "0.875rem", color: "var(--muted)" }}>
        Selected:{" "}
        {selectedItems().length > 0 ? selectedItems().join(", ") : "None"}
      </p>
    </div>
  )
}
