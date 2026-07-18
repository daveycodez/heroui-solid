import { Bars, Pencil, SquarePlus, TrashBin } from "gravity-icons-solid"
import {
  Button,
  Description,
  Dropdown,
  Header,
  Kbd,
  Label,
  Separator
} from "heroui-solid"

export function WithDisabledItems() {
  return (
    <Dropdown>
      <Button isIconOnly aria-label="Menu" variant="secondary">
        <Bars class="outline-none" />
      </Button>
      <Dropdown.Popover class="min-w-[220px]">
        <Dropdown.Menu
          disabledKeys={["delete-file"]}
          onAction={(key) => console.log(`Selected: ${key}`)}
        >
          <Dropdown.Section>
            <Header>Actions</Header>
            <Dropdown.Item id="new-file" textValue="New file">
              <div class="flex h-8 items-start justify-center pt-px">
                <SquarePlus class="size-4 shrink-0 text-muted" />
              </div>
              <div class="flex flex-col">
                <Label>New file</Label>
                <Description>Create a new file</Description>
              </div>
              <Kbd class="ms-auto" slot="keyboard" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>N</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
            <Dropdown.Item id="edit-file" textValue="Edit file">
              <div class="flex h-8 items-start justify-center pt-px">
                <Pencil class="size-4 shrink-0 text-muted" />
              </div>
              <div class="flex flex-col">
                <Label>Edit file</Label>
                <Description>Make changes</Description>
              </div>
              <Kbd class="ms-auto" slot="keyboard" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>E</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section>
            <Header>Danger zone</Header>
            <Dropdown.Item
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
              <Kbd class="ms-auto" slot="keyboard" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Abbr keyValue="shift" />
                <Kbd.Content>D</Kbd.Content>
              </Kbd>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
