import { Description, ErrorMessage, Label, Tag, TagGroup } from "heroui-solid"
import { createSignal } from "solid-js"

export function ErrorMessageBasic() {
  const [selected, setSelected] = createSignal<Set<string>>(new Set())

  const isInvalid = () => Array.from(selected()).length === 0

  return (
    <TagGroup
      selectedKeys={selected()}
      selectionMode="multiple"
      onSelectionChange={(keys) => setSelected(keys)}
    >
      <Label>Required Categories</Label>
      <TagGroup.List>
        <Tag id="news">News</Tag>
        <Tag id="travel">Travel</Tag>
        <Tag id="gaming">Gaming</Tag>
        <Tag id="shopping">Shopping</Tag>
      </TagGroup.List>
      <Description>Select at least one category</Description>
      <ErrorMessage>
        {isInvalid() && <>Please select at least one category</>}
      </ErrorMessage>
    </TagGroup>
  )
}
