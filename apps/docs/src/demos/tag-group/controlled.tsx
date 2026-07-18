import { Description, Label, Tag, TagGroup } from "heroui-solid"
import { createSignal } from "solid-js"

export function TagGroupControlled() {
  const [selected, setSelected] = createSignal<Set<string>>(
    new Set(["news", "travel"])
  )

  return (
    <div class="flex flex-col gap-3">
      <TagGroup
        selectedKeys={selected()}
        selectionMode="multiple"
        onSelectionChange={(keys) => setSelected(keys)}
      >
        <Label>Categories (controlled)</Label>
        <TagGroup.List>
          <Tag id="news">News</Tag>
          <Tag id="travel">Travel</Tag>
          <Tag id="gaming">Gaming</Tag>
          <Tag id="shopping">Shopping</Tag>
        </TagGroup.List>
        <Description>
          Selected:{" "}
          {Array.from(selected()).length > 0
            ? Array.from(selected()).join(", ")
            : "None"}
        </Description>
      </TagGroup>
    </div>
  )
}
