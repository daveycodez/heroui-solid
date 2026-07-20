import { Button, Card } from "heroui-solid"

export function Horizontal() {
  return (
    <Card class="w-full items-stretch md:flex-row">
      <div class="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-2xl">
        <img
          alt="Cherries"
          class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
        />
      </div>
      <div class="flex flex-1 flex-col gap-3">
        <Card.Header class="gap-1">
          <Card.Title>Become an ACME Creator!</Card.Title>
          <Card.Description>
            Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam
            dolor sed amet faucibus etiam.
          </Card.Description>
        </Card.Header>
        <Card.Footer class="mt-auto flex w-full items-center justify-between gap-3">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-foreground">
              Only 10 spots
            </span>
            <span class="text-xs text-muted">Submission ends Oct 10.</span>
          </div>
          <Button>Apply Now</Button>
        </Card.Footer>
      </div>
    </Card>
  )
}
