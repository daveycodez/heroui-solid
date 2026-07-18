import { Avatar, Card } from "heroui-solid"

export function WithAvatar() {
  return (
    <div class="flex flex-wrap gap-4">
      <Card class="w-[200px] gap-2">
        <img
          alt="Indie Hackers community"
          class="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
        />
        <Card.Header>
          <Card.Title>Indie Hackers</Card.Title>
          <Card.Description>148 members</Card.Description>
        </Card.Header>
        <Card.Footer class="flex gap-2">
          <Avatar aria-label="Martha's profile picture" class="size-5">
            <Avatar.Image
              alt="Martha's avatar"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
            />
            <Avatar.Fallback class="text-xs">IH</Avatar.Fallback>
          </Avatar>
          <span class="text-xs">By Martha</span>
        </Card.Footer>
      </Card>

      <Card class="w-[200px] gap-2">
        <img
          alt="AI Builders community"
          class="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg"
        />
        <Card.Header>
          <Card.Title>AI Builders</Card.Title>
          <Card.Description>362 members</Card.Description>
        </Card.Header>
        <Card.Footer class="flex gap-2">
          <Avatar aria-label="John's profile picture" class="size-5">
            <Avatar.Image
              alt="John's avatar - blue themed"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            />
            <Avatar.Fallback class="text-xs">B</Avatar.Fallback>
          </Avatar>
          <span class="text-xs">By John</span>
        </Card.Footer>
      </Card>
    </div>
  )
}
