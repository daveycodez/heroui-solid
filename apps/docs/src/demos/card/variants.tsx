import { Card } from "heroui-solid"
import { For } from "solid-js"

const variants = [
  {
    variant: "transparent",
    description: "Minimal prominence with transparent background",
    content: "Use for less important content or nested cards"
  },
  {
    variant: "default",
    description: "Standard card appearance (bg-surface)",
    content: "The default card variant for most use cases"
  },
  {
    variant: "secondary",
    description: "Medium prominence (bg-surface-secondary)",
    content: "Use to draw moderate attention"
  },
  {
    variant: "tertiary",
    description: "Higher prominence (bg-surface-tertiary)",
    content: "Use for primary or featured content"
  }
] as const

export function CardVariants() {
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
      <For each={variants}>
        {(entry) => (
          <Card style={{ width: "320px" }} variant={entry.variant}>
            <Card.Header>
              <Card.Title style={{ "text-transform": "capitalize" }}>
                {entry.variant}
              </Card.Title>
              <Card.Description>{entry.description}</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>{entry.content}</p>
            </Card.Content>
          </Card>
        )}
      </For>
    </div>
  )
}
