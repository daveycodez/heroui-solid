import { ChevronDown, ChevronUp } from "gravity-icons-solid"
import {
  Accordion,
  Button,
  type Key,
  useDisclosureGroupNavigation
} from "heroui-solid"
import { createSignal, For } from "solid-js"

const items = [
  {
    content:
      "Learn the basics of HeroUI and how to integrate it into your React project. This section covers installation, setup, and your first component.",
    id: "getting-started",
    title: "Getting Started"
  },
  {
    content:
      "Understand the fundamental concepts behind HeroUI, including the compound component pattern, styling with Tailwind CSS, and accessibility features.",
    id: "core-concepts",
    title: "Core Concepts"
  },
  {
    content:
      "Explore advanced features like custom variants, theme customization, and integration with other libraries in your React ecosystem.",
    id: "advanced-usage",
    title: "Advanced Usage"
  }
]

export function Controlled() {
  const [expandedKeys, setExpandedKeys] = createSignal<Set<Key>>(
    new Set(["getting-started"])
  )
  const itemIds = items.map((item) => item.id)

  const { isNextDisabled, isPrevDisabled, onNext, onPrevious } =
    useDisclosureGroupNavigation({
      expandedKeys,
      itemIds,
      onExpandedChange: setExpandedKeys
    })

  return (
    <div class="w-full max-w-md">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-muted">
          Expanded: <strong>{[...expandedKeys()].join(", ") || "none"}</strong>
        </p>
        <div class="flex gap-2">
          <Button
            aria-label="Previous item"
            isDisabled={isPrevDisabled()}
            size="sm"
            variant="secondary"
            onClick={onPrevious}
          >
            <ChevronUp class="size-4" />
          </Button>
          <Button
            aria-label="Next item"
            isDisabled={isNextDisabled()}
            size="sm"
            variant="secondary"
            onClick={onNext}
          >
            <ChevronDown class="size-4" />
          </Button>
        </div>
      </div>
      <Accordion
        collapsible
        value={[...expandedKeys()].map(String)}
        onChange={(keys) => setExpandedKeys(new Set(keys))}
      >
        <For each={items}>
          {(item) => (
            <Accordion.Item value={item.id}>
              <Accordion.Header>
                <Accordion.Trigger>
                  {item.title}
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>{item.content}</Accordion.Content>
            </Accordion.Item>
          )}
        </For>
      </Accordion>
    </div>
  )
}
