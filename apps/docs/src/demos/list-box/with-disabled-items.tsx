import { Pencil, SquarePlus, TrashBin } from "gravity-icons-solid"
import {
  Description,
  Header,
  Kbd,
  Label,
  ListBox,
  Separator,
  Surface
} from "heroui-solid"

export function WithDisabledItems() {
  return (
    <Surface class="w-[256px] rounded-3xl shadow-surface">
      <ListBox
        aria-label="File actions"
        class="w-full p-2"
        disabledKeys={["delete-file"]}
        selectionMode="none"
        onAction={(key) => alert(`Selected item: ${key}`)}
      >
        <ListBox.Section>
          <Header>Actions</Header>
          <ListBox.Item id="new-file" textValue="New file">
            <div class="flex h-8 items-start justify-center pt-px">
              <SquarePlus class="size-4 shrink-0 text-muted" />
            </div>
            <div class="flex flex-col">
              <Label>New file</Label>
              <Description>Create a new file</Description>
            </div>
            <Kbd class="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>N</Kbd.Content>
            </Kbd>
          </ListBox.Item>
          <ListBox.Item id="edit-file" textValue="Edit file">
            <div class="flex h-8 items-start justify-center pt-px">
              <Pencil class="size-4 shrink-0 text-muted" />
            </div>
            <div class="flex flex-col">
              <Label>Edit file</Label>
              <Description>Make changes</Description>
            </div>
            <Kbd class="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>E</Kbd.Content>
            </Kbd>
          </ListBox.Item>
        </ListBox.Section>
        <Separator />
        <ListBox.Section>
          <Header>Danger zone</Header>
          <ListBox.Item
            id="delete-file"
            textValue="Delete file"
            variant="danger"
          >
            <div class="flex h-8 items-start justify-center pt-px">
              <TrashBin class="size-4 shrink-0 text-danger" />
            </div>
            <div class="flex flex-col">
              <Label>Delete file</Label>
              <Description>Move to trash</Description>
            </div>
            <Kbd class="ms-auto" variant="light">
              <Kbd.Abbr keyValue="command" />
              <Kbd.Abbr keyValue="shift" />
              <Kbd.Content>D</Kbd.Content>
            </Kbd>
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </Surface>
  )
}
