import { cn, tagVariants } from "@heroui/styles"
import { callHandler } from "@kobalte/utils"
import {
  type ComponentProps,
  createContext,
  createMemo,
  createUniqueId,
  type JSX,
  onCleanup,
  onMount,
  splitProps,
  useContext
} from "solid-js"

import { CloseButtonRoot } from "../close-button/close-button"
import {
  type TagKey,
  type TagSize,
  type TagVariant,
  useTagGroup
} from "../tag-group/tag-group"

/* -------------------------------------------------------------------------------------------------
 * Tag Context
 * -----------------------------------------------------------------------------------------------*/
type TagRenderProps = {
  allowsRemoving: boolean
  isSelected: boolean
  isDisabled: boolean
}

type TagContextValue = {
  slots: () => ReturnType<typeof tagVariants>
  tagKey: () => TagKey
}

const TagContext = createContext<TagContextValue>()

const useTag = (): TagContextValue => {
  const ctx = useContext(TagContext)
  if (!ctx) {
    throw new Error("Tag.RemoveButton must be used within <Tag>")
  }
  return ctx
}

/* -------------------------------------------------------------------------------------------------
 * Tag Root
 * -----------------------------------------------------------------------------------------------*/
interface TagRootProps {
  id?: TagKey
  textValue?: string
  isDisabled?: boolean
  size?: TagSize
  variant?: TagVariant
  class?: string
  children?: JSX.Element | ((renderProps: TagRenderProps) => JSX.Element)
}

const TagRoot = (props: TagRootProps) => {
  const group = useTagGroup()
  // Fallback key for tags with no id/textValue — hydration-stable and unique so
  // keyless tags don't collide in selection/roving state.
  const uid = createUniqueId()
  const key = () => props.id ?? props.textValue ?? uid
  const disabled = () => !!props.isDisabled || group.isDisabled(key())
  const selected = () => group.isSelected(key())
  const slots = createMemo(() =>
    tagVariants({
      size: props.size ?? group.size(),
      variant: props.variant ?? group.variant()
    })
  )

  let el!: HTMLDivElement
  onMount(() => {
    const cleanup = group.register({ key: key(), el, disabled })
    onCleanup(cleanup)
  })

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (
    event
  ) => {
    if (disabled()) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      group.toggle(key())
    } else if (
      (event.key === "Delete" || event.key === "Backspace") &&
      group.allowsRemoving()
    ) {
      event.preventDefault()
      group.remove(new Set([key()]))
    }
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: row mirrors React Aria's TagGroup grid structure
    // biome-ignore lint/a11y/useFocusableInteractive: focusable via roving tabindex (dynamic value)
    <div
      ref={el}
      class={cn(slots().base(), props.class)}
      data-slot="tag"
      role="row"
      tabindex={group.tabStopKey() === key() ? 0 : -1}
      aria-selected={group.selectionMode() !== "none" ? selected() : undefined}
      aria-disabled={disabled() ? "true" : undefined}
      data-selected={selected() ? "true" : undefined}
      data-disabled={disabled() ? "true" : undefined}
      onClick={() => {
        if (!disabled() && group.selectionMode() !== "none") group.toggle(key())
      }}
      onKeyDown={handleKeyDown}
    >
      <TagContext.Provider value={{ slots, tagKey: key }}>
        {(() => {
          const body = props.children
          if (typeof body === "function") {
            return (body as (renderProps: TagRenderProps) => JSX.Element)({
              get allowsRemoving() {
                return group.allowsRemoving()
              },
              get isSelected() {
                return selected()
              },
              get isDisabled() {
                return disabled()
              }
            })
          }
          return (
            <>
              {body}
              {group.allowsRemoving() && <TagRemoveButton />}
            </>
          )
        })()}
      </TagContext.Provider>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tag Remove Button
 * -----------------------------------------------------------------------------------------------*/
interface TagRemoveButtonProps extends ComponentProps<typeof CloseButtonRoot> {}

const TagRemoveButton = (props: TagRemoveButtonProps) => {
  const tag = useTag()
  const group = useTagGroup()
  const [local, rest] = splitProps(props as TagRemoveButtonProps, [
    "class",
    "children",
    "onClick"
  ])

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
    event.stopPropagation()
    callHandler(
      event,
      local.onClick as JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
    )
    group.remove(new Set([tag.tagKey()]))
  }

  return (
    <CloseButtonRoot
      aria-label="Remove tag"
      class={cn(tag.slots().removeButton(), local.class)}
      data-slot="tag-remove-button"
      slot="remove"
      tabindex={-1}
      onClick={handleClick}
      {...rest}
    >
      {local.children}
    </CloseButtonRoot>
  )
}

export type {
  TagContextValue,
  TagRemoveButtonProps,
  TagRenderProps,
  TagRootProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { TagContext, TagRemoveButton, TagRoot }
