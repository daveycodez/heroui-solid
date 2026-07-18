import { Button, Card, Form, Input, Label, Link, TextField } from "heroui-solid"

export function WithForm() {
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
      <Form onSubmit={onSubmit}>
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
          <Link class="text-center text-sm" href="#">
            Forgot password?
          </Link>
        </Card.Footer>
      </Form>
    </Card>
  )
}
