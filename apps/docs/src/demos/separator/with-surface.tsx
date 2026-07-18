import { Separator, Surface } from "heroui-solid"

export function WithSurface() {
  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="default"
        >
          <h3 class="text-base font-semibold text-foreground">
            Default Surface
          </h3>
          <Separator />
          <p class="text-sm text-muted">Surface Content</p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="secondary"
        >
          <h3 class="text-base font-semibold text-foreground">
            Secondary Surface
          </h3>
          <Separator variant="secondary" />
          <p class="text-sm text-muted">Surface Content</p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
          variant="tertiary"
        >
          <h3 class="text-base font-semibold text-foreground">
            Tertiary Surface
          </h3>
          <Separator variant="tertiary" />
          <p class="text-sm text-muted">Surface Content</p>
        </Surface>
      </div>

      <div class="flex flex-col gap-2">
        <Surface
          class="flex min-w-[320px] flex-col gap-3 rounded-3xl border p-6"
          variant="transparent"
        >
          <h3 class="text-base font-semibold text-foreground">
            Transparent Surface
          </h3>
          <Separator />
          <p class="text-sm text-muted">Surface Content</p>
        </Surface>
      </div>
    </div>
  )
}
