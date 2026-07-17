import { Button, Card, Input, Label, TextField } from "heroui-solid"

export function CardWithForm() {
  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    alert("Form submitted successfully!")
  }

  return (
    <Card class="w-full max-w-md">
      <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>
          Enter your credentials to access your account
        </Card.Description>
      </Card.Header>
      <form onSubmit={onSubmit}>
        <Card.Content>
          <div class="flex flex-col gap-4">
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
        <Card.Footer class="mt-4 flex flex-col gap-2">
          <Button fullWidth type="submit">
            Sign In
          </Button>
          <a class="text-center text-sm" href="#forgot">
            Forgot password?
          </a>
        </Card.Footer>
      </form>
    </Card>
  )
}
