import { Person } from "gravity-icons-solid"
import { Avatar, Separator } from "heroui-solid"
import { For, type JSX, Show } from "solid-js"

export function Variants() {
  const colors = ["accent", "default", "success", "warning", "danger"] as const
  const variants = [
    { content: "AG", label: "letter", type: "letter" },
    { content: "AG", label: "letter soft", type: "letter-soft" },
    { content: () => <Person />, label: "icon", type: "icon" },
    { content: () => <Person />, label: "icon soft", type: "icon-soft" },
    {
      content: [
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=4",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=5",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=8",
        "https://img.heroui.chat/image/avatar?w=400&h=400&u=16"
      ],
      label: "img",
      type: "img"
    }
  ] as const

  // Elements are real DOM nodes in Solid, so icon content is a factory
  // called per cell instead of a shared element like upstream's React JSX.
  const renderContent = (content: string | (() => JSX.Element)) =>
    typeof content === "function" ? content() : content

  return (
    <div class="flex flex-col gap-4">
      {/* Color labels header */}
      <div class="flex items-center gap-3">
        <div class="w-24 shrink-0" />
        <For each={colors}>
          {(color) => (
            <div class="flex w-20 shrink-0 items-center justify-center">
              <span class="text-xs text-muted capitalize">{color}</span>
            </div>
          )}
        </For>
      </div>

      <Separator />

      {/* Variant rows */}
      <For each={variants}>
        {(variant) => (
          <div class="flex items-center gap-3">
            <div class="w-24 shrink-0 text-sm text-muted">{variant.label}</div>
            <For each={colors}>
              {(color, colorIndex) => (
                <div class="flex w-20 shrink-0 items-center justify-center">
                  <Avatar
                    color={color}
                    fallbackDelay={variant.type === "img" ? 600 : undefined}
                    variant={variant.type.includes("soft") ? "soft" : undefined}
                  >
                    <Show
                      when={variant.type === "img"}
                      fallback={
                        <Avatar.Fallback>
                          {renderContent(
                            variant.content as string | (() => JSX.Element)
                          )}
                        </Avatar.Fallback>
                      }
                    >
                      <Avatar.Image
                        alt={`Avatar ${color}`}
                        src={
                          Array.isArray(variant.content)
                            ? variant.content[colorIndex()]
                            : ""
                        }
                      />
                      <Avatar.Fallback>
                        {color.charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Show>
                  </Avatar>
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}
