import { ScrollShadow } from "heroui-solid"
import { For } from "solid-js"

export function CustomSize() {
  return (
    <div class="w-full p-0 sm:max-w-sm">
      <ScrollShadow class="max-h-[240px] p-4" size={80}>
        <div class="space-y-4">
          <For each={Array.from({ length: 10 })}>
            {() => (
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam. Morbi accumsan cursus
                enim, sed ultricies sapien.
              </p>
            )}
          </For>
        </div>
      </ScrollShadow>
    </div>
  )
}
