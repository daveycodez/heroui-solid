import { Surface } from "heroui-solid"
import { For } from "solid-js"

const surfaceStyle = {
  display: "flex",
  "min-width": "320px",
  "flex-direction": "column",
  gap: "0.75rem",
  "border-radius": "1.5rem",
  padding: "1.5rem"
} as const

const variants = [
  {
    label: "Default",
    variant: "default",
    description:
      "This is a default surface variant. It uses bg-surface styling."
  },
  {
    label: "Secondary",
    variant: "secondary",
    description:
      "This is a secondary surface variant. It uses bg-surface-secondary styling."
  },
  {
    label: "Tertiary",
    variant: "tertiary",
    description:
      "This is a tertiary surface variant. It uses bg-surface-tertiary styling."
  },
  {
    label: "Transparent",
    variant: "transparent",
    description:
      "This is a transparent surface variant. It has no background, suitable for overlays and cards with custom backgrounds."
  }
] as const

export function SurfaceVariants() {
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
      <For each={variants}>
        {(entry) => (
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "0.5rem"
            }}
          >
            <p
              style={{
                "font-size": "0.875rem",
                "font-weight": "500",
                color: "var(--muted)"
              }}
            >
              {entry.label}
            </p>
            <Surface
              style={
                entry.variant === "transparent"
                  ? { ...surfaceStyle, border: "1px solid var(--border)" }
                  : surfaceStyle
              }
              variant={entry.variant}
            >
              <h3
                style={{
                  "font-size": "1rem",
                  "font-weight": "600",
                  color: "var(--foreground)"
                }}
              >
                Surface Content
              </h3>
              <p style={{ "font-size": "0.875rem", color: "var(--muted)" }}>
                {entry.description}
              </p>
            </Surface>
          </div>
        )}
      </For>
    </div>
  )
}
