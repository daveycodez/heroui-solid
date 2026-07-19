import { Avatar } from "heroui-solid"

export function CustomStyles() {
  return (
    <div class="flex items-center gap-4">
      {/* Custom size with Tailwind classes */}
      <Avatar class="size-16" fallbackDelay={600}>
        <Avatar.Image
          alt="Extra Large"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
        />
        <Avatar.Fallback>XL</Avatar.Fallback>
      </Avatar>

      {/* Square avatar */}
      <Avatar class="rounded-lg" fallbackDelay={600}>
        <Avatar.Image
          alt="Square Avatar"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
        />
        <Avatar.Fallback class="rounded-lg">SQ</Avatar.Fallback>
      </Avatar>

      {/* Gradient border */}
      <Avatar
        class="bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5"
        fallbackDelay={600}
      >
        <div class="size-full rounded-full bg-background p-0.5">
          <Avatar.Image
            alt="Gradient Border"
            class="rounded-full"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
          />
          <Avatar.Fallback class="border-none">GB</Avatar.Fallback>
        </div>
      </Avatar>

      {/* Status indicator */}
      <div class="relative">
        <Avatar fallbackDelay={600}>
          <Avatar.Image
            alt="Online User"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"
          />
          <Avatar.Fallback>ON</Avatar.Fallback>
        </Avatar>
        <span class="absolute right-0 bottom-0 size-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>
    </div>
  )
}
