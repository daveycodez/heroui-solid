import { type Accessor, createMemo } from "solid-js"
import type { Key } from "./types"

interface UseDisclosureGroupNavigationProps {
  expandedKeys: Accessor<Set<Key>>
  itemIds: string[]
  onExpandedChange: (keys: Set<Key>) => void
  allowsMultipleExpanded?: boolean
}

interface UseDisclosureGroupNavigationReturn {
  currentIndex: Accessor<number>
  isPrevDisabled: Accessor<boolean>
  isNextDisabled: Accessor<boolean>
  onPrevious: () => void
  onNext: () => void
}

function useDisclosureGroupNavigation(
  props: UseDisclosureGroupNavigationProps
): UseDisclosureGroupNavigationReturn {
  const currentIndex = createMemo(() => {
    const expandedItems = props.itemIds.filter((id) =>
      props.expandedKeys().has(id)
    )
    const currentItem =
      expandedItems.length > 0 ? expandedItems[0] : props.itemIds[0]

    if (!currentItem) return -1

    return props.itemIds.indexOf(currentItem)
  })

  const handlePrevious = () => {
    if (currentIndex() <= 0) return

    const prevItem = props.itemIds[currentIndex() - 1]

    if (!prevItem) return

    if (props.allowsMultipleExpanded) {
      const newKeys = new Set(props.expandedKeys())

      newKeys.add(prevItem)
      props.onExpandedChange(newKeys)
    } else {
      props.onExpandedChange(new Set([prevItem]))
    }
  }

  const handleNext = () => {
    if (currentIndex() >= props.itemIds.length - 1) return

    const nextItem = props.itemIds[currentIndex() + 1]

    if (!nextItem) return

    if (props.allowsMultipleExpanded) {
      const newKeys = new Set(props.expandedKeys())

      newKeys.add(nextItem)
      props.onExpandedChange(newKeys)
    } else {
      props.onExpandedChange(new Set([nextItem]))
    }
  }

  return {
    currentIndex,
    isPrevDisabled: () => currentIndex() <= 0,
    isNextDisabled: () => currentIndex() >= props.itemIds.length - 1,
    onPrevious: handlePrevious,
    onNext: handleNext
  }
}

export type {
  UseDisclosureGroupNavigationProps,
  UseDisclosureGroupNavigationReturn
}
export { useDisclosureGroupNavigation }
