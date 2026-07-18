import { Check } from "gravity-icons-solid"
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField
} from "heroui-solid"
import { createSignal } from "solid-js"

export function Basic() {
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")

  const validateEmail = (value: string) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return "Please enter a valid email address"
    }
    return null
  }

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters"
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const emailError = () => (email() ? validateEmail(email()) : null)
  const passwordError = () => (password() ? validatePassword(password()) : null)

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const data: Record<string, string> = {}

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    alert(`Form submitted with: ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <Form class="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
      <TextField
        isInvalid={!!emailError()}
        isRequired
        name="email"
        onChange={setEmail}
        value={email()}
      >
        <Label>Email</Label>
        <Input placeholder="john@example.com" type="email" />
        <FieldError>{emailError()}</FieldError>
      </TextField>

      <TextField
        isInvalid={!!passwordError()}
        isRequired
        name="password"
        onChange={setPassword}
        value={password()}
      >
        <Label>Password</Label>
        <Input
          minLength={8}
          placeholder="Enter your password"
          type="password"
        />
        <Description>
          Must be at least 8 characters with 1 uppercase and 1 number
        </Description>
        <FieldError>{passwordError()}</FieldError>
      </TextField>

      <div class="flex gap-2">
        <Button type="submit">
          <Check />
          Submit
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </Form>
  )
}
