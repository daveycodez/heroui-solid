import { CircleXmarkFill } from "gravity-icons-solid"
import { Description, EmptyState, Label, Tag, TagGroup } from "heroui-solid"
import { createSignal } from "solid-js"

type TagItem = { id: string; name: string }

export function TagGroupWithRemoveButton() {
  const [tags, setTags] = createSignal<TagItem[]>([
    { id: "news", name: "News" },
    { id: "travel", name: "Travel" },
    { id: "gaming", name: "Gaming" },
    { id: "shopping", name: "Shopping" }
  ])

  const [frameworks, setFrameworks] = createSignal<TagItem[]>([
    { id: "react", name: "React" },
    { id: "vue", name: "Vue" },
    { id: "angular", name: "Angular" },
    { id: "svelte", name: "Svelte" }
  ])

  const onRemoveTags = (keys: Set<string>) => {
    setTags(tags().filter((tag) => !keys.has(tag.id)))
  }

  const onRemoveFrameworks = (keys: Set<string>) => {
    setFrameworks(frameworks().filter((framework) => !keys.has(framework.id)))
  }

  return (
    <div class="flex flex-col gap-8">
      <div class="w-sm">
        <TagGroup selectionMode="single" onRemove={onRemoveTags}>
          <Label>Default Remove Button</Label>
          <TagGroup.List
            items={tags()}
            renderEmptyState={() => (
              <EmptyState class="p-1">No categories found</EmptyState>
            )}
          >
            {(tag) => (
              <Tag id={tag.id} textValue={tag.name}>
                {tag.name}
              </Tag>
            )}
          </TagGroup.List>
          <Description>Click the X to remove tags</Description>
        </TagGroup>
      </div>

      <div class="w-md">
        <TagGroup selectionMode="single" onRemove={onRemoveFrameworks}>
          <Label>Custom Remove Button</Label>
          <TagGroup.List
            items={frameworks()}
            renderEmptyState={() => (
              <EmptyState class="p-1">No frameworks found</EmptyState>
            )}
          >
            {(tag) => (
              <Tag id={tag.id} textValue={tag.name}>
                {(renderProps) => (
                  <>
                    {tag.name}
                    {renderProps.allowsRemoving && (
                      <Tag.RemoveButton>
                        <CircleXmarkFill />
                      </Tag.RemoveButton>
                    )}
                  </>
                )}
              </Tag>
            )}
          </TagGroup.List>
          <Description>Custom remove button with icon</Description>
        </TagGroup>
      </div>
    </div>
  )
}
