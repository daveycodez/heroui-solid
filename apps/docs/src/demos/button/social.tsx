import { Button } from "heroui-solid"
import GoogleIcon from "~icons/devicon/google"
import AppleIcon from "~icons/ion/logo-apple"
import GitHubIcon from "~icons/mdi/github"

export function Social() {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "0.75rem",
        width: "100%",
        "max-width": "20rem"
      }}
    >
      <Button variant="tertiary" fullWidth>
        <GoogleIcon />
        Sign in with Google
      </Button>
      <Button variant="tertiary" fullWidth>
        <GitHubIcon />
        Sign in with GitHub
      </Button>
      <Button variant="tertiary" fullWidth>
        <AppleIcon />
        Sign in with Apple
      </Button>
    </div>
  )
}
