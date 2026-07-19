import { Avatar } from "heroui-solid"

export function Sizes() {
  return (
    <div class="flex items-center gap-4">
      <Avatar fallbackDelay={600} size="sm">
        <Avatar.Image
          alt="Small Avatar"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
        />
        <Avatar.Fallback>SM</Avatar.Fallback>
      </Avatar>
      <Avatar fallbackDelay={600} size="md">
        <Avatar.Image
          alt="Medium Avatar"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
        />
        <Avatar.Fallback>MD</Avatar.Fallback>
      </Avatar>
      <Avatar fallbackDelay={600} size="lg">
        <Avatar.Image
          alt="Large Avatar"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
        />
        <Avatar.Fallback>LG</Avatar.Fallback>
      </Avatar>
    </div>
  )
}
