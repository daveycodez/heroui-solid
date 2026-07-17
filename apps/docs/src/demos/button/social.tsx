import { Button } from "heroui-solid"
import GoogleIcon from "~icons/devicon/google"
import AppleIcon from "~icons/ion/logo-apple"
import GitHubIcon from "~icons/mdi/github"

export function Social() {
  return (
    <div class="flex w-full max-w-xs flex-col gap-3">
      <Button class="w-full" variant="tertiary">
        <GoogleIcon />
        Sign in with Google
      </Button>
      <Button class="w-full" variant="tertiary">
        <GitHubIcon />
        Sign in with GitHub
      </Button>
      <Button class="w-full" variant="tertiary">
        <AppleIcon />
        Sign in with Apple
      </Button>
    </div>
  )
}
