import { ChevronDown } from "gravity-icons-solid"
import { Accordion, cn } from "heroui-solid"
import { For } from "solid-js"

const items = [
  {
    content:
      "Stay informed about your account activity with real-time notifications. ",
    iconUrl:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/bell-small.png",
    subtitle: "Receive account activity updates",
    title: "Set Up Notifications"
  },
  {
    content:
      "Enhance your browsing experience by installing our official browser extension",
    iconUrl:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/compass-small.png",
    subtitle: "Connect your browser to your account",
    title: "Set up Browser Extension"
  },
  {
    content:
      "Begin your journey into the world of digital collectibles by creating your first NFT. ",
    iconUrl:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/3dicons/mint-collective-small.png",
    subtitle: "Create your first collectible",
    title: "Mint Collectible"
  }
]

export function CustomStyles() {
  return (
    <Accordion
      class="bg-surface-1/10 w-full max-w-md rounded-2xl"
      variant="surface"
    >
      <For each={items}>
        {(item) => (
          <Accordion.Item
            class={cn(
              "group/item",
              "first:[&_[data-slot=accordion-trigger]]:rounded-t-2xl", // First trigger we want to round the top
              "last:[&:not(:has([data-slot=accordion-trigger][aria-expanded='true']))_[data-slot=accordion-trigger]]:rounded-b-2xl" // Last trigger we want to round the bottom
            )}
          >
            <Accordion.Heading>
              <Accordion.Trigger class="hover:bgsurface group flex items-center gap-2 transition-none">
                {item.iconUrl ? (
                  <img
                    alt={item.title}
                    class="h-11 w-11 transition-[scale,rotate] duration-300 ease-out group-hover/item:scale-120 group-hover/item:-rotate-10 group-hover/item:drop-shadow-lg"
                    src={item.iconUrl}
                  />
                ) : null}
                <div class="flex flex-col gap-0">
                  <span class="leading-5 font-medium">{item.title}</span>
                  <span class="leading-6 font-normal text-muted/80">
                    {item.subtitle}
                  </span>
                </div>
                <Accordion.Indicator class="text-muted/50 [&>svg]:size-4">
                  <ChevronDown />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body class="text-muted/80">
                {item.content}
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        )}
      </For>
    </Accordion>
  )
}
