import { Button, Card } from "heroui-solid"
import Xmark from "~icons/gravity-ui/xmark"

export function CardHorizontal() {
  return (
    <Card
      style={{
        width: "100%",
        "max-width": "36rem",
        "align-items": "stretch",
        "flex-direction": "row"
      }}
    >
      <div
        style={{
          position: "relative",
          height: "120px",
          width: "120px",
          "flex-shrink": "0",
          overflow: "hidden",
          "border-radius": "1rem"
        }}
      >
        <img
          alt="Cherries"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
          style={{
            position: "absolute",
            inset: "0",
            height: "100%",
            width: "100%",
            scale: "1.25",
            "object-fit": "cover",
            "pointer-events": "none",
            "user-select": "none"
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flex: "1",
          "flex-direction": "column",
          gap: "0.75rem"
        }}
      >
        <Card.Header style={{ gap: "0.25rem" }}>
          <Card.Title style={{ "padding-right": "2rem" }}>
            Become an ACME Creator!
          </Card.Title>
          <Card.Description>
            Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam
            dolor sed amet faucibus etiam.
          </Card.Description>
          <Button
            aria-label="Close banner"
            isIconOnly
            size="sm"
            variant="ghost"
            style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}
          >
            <Xmark />
          </Button>
        </Card.Header>
        <Card.Footer
          style={{
            "margin-top": "auto",
            display: "flex",
            width: "100%",
            "align-items": "center",
            "justify-content": "space-between",
            gap: "0.75rem"
          }}
        >
          <div style={{ display: "flex", "flex-direction": "column" }}>
            <span
              style={{
                "font-size": "0.875rem",
                "font-weight": "500",
                color: "var(--foreground)"
              }}
            >
              Only 10 spots
            </span>
            <span style={{ "font-size": "0.75rem", color: "var(--muted)" }}>
              Submission ends Oct 10.
            </span>
          </div>
          <Button>Apply Now</Button>
        </Card.Footer>
      </div>
    </Card>
  )
}
