import { ComboBox, Description, Input, Label, ListBox } from "heroui-solid"

export function MenuTrigger() {
  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Focus (default)</p>
        <ComboBox class="w-[256px]" menuTrigger="focus">
          <Label>Favorite Animal</Label>
          <ComboBox.InputGroup>
            <Input placeholder="Search animals..." />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover>
            <ListBox>
              <ListBox.Item id="aardvark" textValue="Aardvark">
                Aardvark
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="cat" textValue="Cat">
                Cat
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="dog" textValue="Dog">
                Dog
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="kangaroo" textValue="Kangaroo">
                Kangaroo
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="panda" textValue="Panda">
                Panda
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="snake" textValue="Snake">
                Snake
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </ComboBox.Popover>
          <Description>Popover opens when the input is focused</Description>
        </ComboBox>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Input</p>
        <ComboBox class="w-[256px]" menuTrigger="input">
          <Label>Favorite Animal</Label>
          <ComboBox.InputGroup>
            <Input placeholder="Search animals..." />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover>
            <ListBox>
              <ListBox.Item id="aardvark" textValue="Aardvark">
                Aardvark
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="cat" textValue="Cat">
                Cat
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="dog" textValue="Dog">
                Dog
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="kangaroo" textValue="Kangaroo">
                Kangaroo
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="panda" textValue="Panda">
                Panda
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="snake" textValue="Snake">
                Snake
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </ComboBox.Popover>
          <Description>
            Popover opens when the user edits the input text
          </Description>
        </ComboBox>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Manual</p>
        <ComboBox class="w-[256px]" menuTrigger="manual">
          <Label>Favorite Animal</Label>
          <ComboBox.InputGroup>
            <Input placeholder="Search animals..." />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover>
            <ListBox>
              <ListBox.Item id="aardvark" textValue="Aardvark">
                Aardvark
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="cat" textValue="Cat">
                Cat
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="dog" textValue="Dog">
                Dog
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="kangaroo" textValue="Kangaroo">
                Kangaroo
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="panda" textValue="Panda">
                Panda
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="snake" textValue="Snake">
                Snake
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </ComboBox.Popover>
          <Description>
            Popover only opens when the trigger button is pressed or arrow keys
            are used
          </Description>
        </ComboBox>
      </div>
    </div>
  )
}
