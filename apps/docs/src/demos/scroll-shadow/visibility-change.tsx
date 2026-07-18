import { Card, ScrollShadow, type ScrollShadowVisibility } from "heroui-solid"
import { createSignal, For } from "solid-js"

const images = [
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg",
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg",
  "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg"
]

export function VisibilityChange() {
  const [verticalState, setVerticalState] =
    createSignal<ScrollShadowVisibility>("none")
  const [horizontalState, setHorizontalState] =
    createSignal<ScrollShadowVisibility>("none")

  const getRandomImage = (idx: number) => {
    return images[idx % images.length]
  }

  return (
    <div class="w-full sm:max-w-sm">
      <div class="mb-8 flex flex-col gap-2">
        <div class="rounded bg-default p-4">
          <p class="text-sm font-semibold">
            Vertical Shadow State: {verticalState()}
          </p>
        </div>
        <div class="w-full">
          <ScrollShadow
            class="max-h-[240px] p-4"
            orientation="vertical"
            onVisibilityChange={(visibility) => setVerticalState(visibility)}
          >
            <div class="space-y-4">
              <For each={Array.from({ length: 10 })}>
                {() => (
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    Morbi accumsan cursus enim, sed ultricies sapien.
                  </p>
                )}
              </For>
            </div>
          </ScrollShadow>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="rounded bg-default p-4">
          <p class="text-sm font-semibold">
            Horizontal Shadow State: {horizontalState()}
          </p>
        </div>
        <div class="w-full">
          <ScrollShadow
            class="p-4"
            orientation="horizontal"
            onVisibilityChange={(visibility) => setHorizontalState(visibility)}
          >
            <div class="flex flex-row gap-4">
              <For each={Array.from({ length: 10 })}>
                {(_, idx) => (
                  <Card
                    class="flex min-w-[200px] flex-row gap-3 p-1"
                    variant="transparent"
                  >
                    <img
                      alt="Lorem Card"
                      class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                      loading="lazy"
                      src={getRandomImage(idx())}
                    />
                    <div class="flex flex-1 flex-col justify-center gap-1">
                      <Card.Title class="text-sm">
                        Bridging the Future
                      </Card.Title>
                      <Card.Description class="text-xs">
                        Today, 6:30 PM
                      </Card.Description>
                    </div>
                  </Card>
                )}
              </For>
            </div>
          </ScrollShadow>
        </div>
      </div>
    </div>
  )
}
