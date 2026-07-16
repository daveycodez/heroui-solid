import { Button, Card, Input, Label, TextField } from "heroui-solid"

export function CardWithForm() {
  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    alert("Form submitted successfully!")
  }

  return (
    <Card style={{ width: "100%", "max-width": "28rem" }}>
      <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>
          Enter your credentials to access your account
        </Card.Description>
      </Card.Header>
      <form onSubmit={onSubmit}>
        <Card.Content>
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "1rem"
            }}
          >
            <TextField name="email">
              <Label>Email</Label>
              <Input
                placeholder="email@example.com"
                type="email"
                variant="secondary"
              />
            </TextField>
            <TextField name="password">
              <Label>Password</Label>
              <Input
                placeholder="••••••••"
                type="password"
                variant="secondary"
              />
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer
          style={{
            "margin-top": "1rem",
            display: "flex",
            "flex-direction": "column",
            gap: "0.5rem"
          }}
        >
          <Button fullWidth type="submit">
            Sign In
          </Button>
          <a
            href="#forgot"
            style={{
              "text-align": "center",
              "font-size": "0.875rem",
              color: "var(--muted)"
            }}
          >
            Forgot password?
          </a>
        </Card.Footer>
      </form>
    </Card>
  )
}
