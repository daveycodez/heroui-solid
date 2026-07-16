import { Card } from "heroui-solid"
import CircleDollar from "~icons/gravity-ui/circle-dollar"

export function CardUsage() {
  return (
    <Card style={{ width: "400px", "max-width": "100%" }}>
      <CircleDollar
        aria-label="Dollar sign icon"
        role="img"
        style={{
          color: "var(--primary)",
          width: "1.5rem",
          height: "1.5rem"
        }}
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
          style={{
            "font-size": "0.875rem",
            "font-weight": "500",
            color: "var(--foreground)",
            "text-decoration": "underline",
            "text-underline-offset": "4px"
          }}
        >
          Creator Hub ↗
        </a>
      </Card.Footer>
    </Card>
  )
}
