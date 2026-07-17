import { Card } from "heroui-solid"
import CircleDollar from "~icons/gravity-ui/circle-dollar"

export function CardUsage() {
  return (
    <Card class="w-[400px]">
      <CircleDollar
        aria-label="Dollar sign icon"
        class="text-primary size-6"
        role="img"
      />
      <Card.Header>
        <Card.Title>Become an Acme Creator!</Card.Title>
        <Card.Description>
          Visit the Acme Creator Hub to sign up today and start earning credits
          from your fans and followers.
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <a
          aria-label="Go to Acme Creator Hub (opens in new tab)"
          href="https://heroui.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Creator Hub ↗
        </a>
      </Card.Footer>
    </Card>
  )
}
