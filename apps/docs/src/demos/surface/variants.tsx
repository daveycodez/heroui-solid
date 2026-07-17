import { Surface } from "heroui-solid"

export function SurfaceVariants() {
  return (
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Default</p>
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="default"
        >
          <h3 class="text-base font-semibold text-foreground">
            Surface Content
          </h3>
          <p class="text-sm text-muted">
            This is a default surface variant. It uses bg-surface styling.
          </p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Secondary</p>
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="secondary"
        >
          <h3 class="text-base font-semibold text-foreground">
            Surface Content
          </h3>
          <p class="text-sm text-muted">
            This is a secondary surface variant. It uses bg-surface-secondary
            styling.
          </p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Tertiary</p>
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="tertiary"
        >
          <h3 class="text-base font-semibold text-foreground">
            Surface Content
          </h3>
          <p class="text-sm text-muted">
            This is a tertiary surface variant. It uses bg-surface-tertiary
            styling.
          </p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Transparent</p>
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl border p-6"
          variant="transparent"
        >
          <h3 class="text-base font-semibold text-foreground">
            Surface Content
          </h3>
          <p class="text-sm text-muted">
            This is a transparent surface variant. It has no background,
            suitable for overlays and cards with custom backgrounds.
          </p>
        </Surface>
      </div>
    </div>
  )
}
