import { Description, Label, ListBox } from "heroui-solid"

export function Default() {
  return (
    <ListBox
      aria-label="Users"
      selectionMode="single"
      style={{ width: "220px" }}
    >
      <ListBox.Item id="1" textValue="Bob">
        <div style={{ display: "flex", "flex-direction": "column" }}>
          <Label>Bob</Label>
          <Description>bob@heroui.com</Description>
        </div>
        <ListBox.ItemIndicator />
      </ListBox.Item>
      <ListBox.Item id="2" textValue="Fred">
        <div style={{ display: "flex", "flex-direction": "column" }}>
          <Label>Fred</Label>
          <Description>fred@heroui.com</Description>
        </div>
        <ListBox.ItemIndicator />
      </ListBox.Item>
      <ListBox.Item id="3" textValue="Martha">
        <div style={{ display: "flex", "flex-direction": "column" }}>
          <Label>Martha</Label>
          <Description>martha@heroui.com</Description>
        </div>
        <ListBox.ItemIndicator />
      </ListBox.Item>
    </ListBox>
  )
}
