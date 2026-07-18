import { Chip, Separator } from "heroui-solid"
import { For } from "solid-js"

const variants = ["primary", "secondary", "tertiary", "soft"] as const
const colors = ["accent", "default", "success", "warning", "danger"] as const

function ChipMatrix(props: { isVibrant?: boolean; title: string }) {
  return (
    <div
      class="flex flex-col gap-4"
      data-vibrant-palette={props.isVibrant ? "true" : undefined}
    >
      <h3 class="text-sm font-semibold text-muted">{props.title}</h3>
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
                    <Chip color={color} size="md" variant={variant}>
                      <Chip.Label class="capitalize">{color}</Chip.Label>
                    </Chip>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export function ChipVibrantPalette() {
  return (
    <div class="flex w-full flex-col gap-8 overflow-x-auto">
      <ChipMatrix title="Default palette" />
      <Separator />
      <ChipMatrix isVibrant title="Vibrant palette" />
    </div>
  )
}
