import { CircleDashed } from "gravity-icons-solid"
import { Chip, Separator } from "heroui-solid"
import { For, Show } from "solid-js"

export function ChipVariants() {
  const sizes = ["lg", "md", "sm"] as const
  const variants = ["primary", "secondary", "tertiary", "soft"] as const
  const colors = ["accent", "default", "success", "warning", "danger"] as const

  return (
    <div class="flex flex-col gap-8 overflow-x-auto">
      <For each={sizes}>
        {(size, index) => (
          <>
            <div class="flex flex-col gap-4">
              <h3 class="text-sm font-semibold text-muted capitalize">
                {size}
              </h3>
              {/* Color labels header */}
              <div class="flex items-center gap-3">
                <div class="w-24 shrink-0" />
                <For each={colors}>
                  {(color) => (
                    <div
                      class="flex shrink-0 items-center justify-center"
                      style={{ width: "130px" }}
                    >
                      <span class="text-xs text-muted capitalize">{color}</span>
                    </div>
                  )}
                </For>
              </div>
              <div class="flex flex-col gap-3">
                <For each={variants}>
                  {(variant) => (
                    <div class="flex items-center gap-3">
                      <div class="w-24 shrink-0 text-sm text-muted capitalize">
                        {variant}
                      </div>
                      <For each={colors}>
                        {(color) => (
                          <div
                            class="flex shrink-0 items-center justify-center"
                            style={{ width: "130px" }}
                          >
                            <Chip color={color} size={size} variant={variant}>
                              <CircleDashed />
                              <Chip.Label>Label</Chip.Label>
                              <CircleDashed />
                            </Chip>
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>
            <Show when={index() < sizes.length - 1}>
              <Separator />
            </Show>
          </>
        )}
      </For>
    </div>
  )
}
