import { Separator, Surface } from "heroui-solid"

export function ManualVariantOverride() {
  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">
          Separator on default surface
        </p>
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="default"
        >
          <h3 class="text-base font-semibold text-foreground">
            Surface Content
          </h3>
          <Separator />
          <p class="text-sm text-muted">
            The separator adapts to the surface background.
          </p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">
          Separator on secondary surface
        </p>
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="secondary"
        >
          <h3 class="text-base font-semibold text-foreground">
            Surface Content
          </h3>
          <Separator />
          <p class="text-sm text-muted">
            The separator adapts to the surface background.
          </p>
        </Surface>
      </div>
    </div>
  )
}
