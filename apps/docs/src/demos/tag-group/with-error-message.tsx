import { Description, ErrorMessage, Label, Tag, TagGroup } from "heroui-solid"
import { createSignal } from "solid-js"

export function TagGroupWithErrorMessage() {
  const [selected, setSelected] = createSignal<Set<string>>(new Set())

  const isInvalid = () => Array.from(selected()).length === 0

  return (
    <TagGroup
      selectedKeys={selected()}
      selectionMode="multiple"
      onSelectionChange={(keys) => setSelected(keys)}
    >
      <Label>Amenities</Label>
      <TagGroup.List>
        <Tag id="laundry">Laundry</Tag>
        <Tag id="fitness">Fitness center</Tag>
        <Tag id="parking">Parking</Tag>
        <Tag id="pool">Swimming pool</Tag>
        <Tag id="breakfast">Breakfast</Tag>
      </TagGroup.List>
      <Description>
        {isInvalid()
          ? "Select at least one category"
          : `Selected: ${Array.from(selected()).join(", ")}`}
      </Description>
      <ErrorMessage>
        {isInvalid() && <>Please select at least one category</>}
      </ErrorMessage>
    </TagGroup>
  )
}
