import { Separator } from "heroui-solid"
import { For } from "solid-js"

const items = [
  {
    iconUrl:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/bell-small.png",
    subtitle: "Receive account activity updates",
    title: "Set Up Notifications"
  },
  {
    iconUrl:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/compass-small.png",
    subtitle: "Connect your browser to your account",
    title: "Set up Browser Extension"
  },
  {
    iconUrl:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/mint-collective-small.png",
    subtitle: "Create your first collectible",
    title: "Mint Collectible"
  }
]

export function WithContent() {
  return (
    <div class="max-w-md space-y-4">
      <For each={items}>
        {(item, index) => (
          <div>
            <div class="flex items-center gap-3">
              <img alt={item.title} class="size-12" src={item.iconUrl} />
              <div class="flex-1 space-y-0">
                <h4 class="text-small font-medium">{item.title}</h4>
                <p class="text-sm text-muted">{item.subtitle}</p>
              </div>
            </div>
            {index() < items.length - 1 && <Separator class="my-4" />}
          </div>
        )}
      </For>
    </div>
  )
}
