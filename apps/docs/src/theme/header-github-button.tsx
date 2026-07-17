import { Button } from "heroui-solid"
import GitHubIcon from "~icons/mdi/github"

// Rendered into solidbase's LocaleSelector slot (single-locale site, the
// default renders nothing) — puts the GitHub button on the right of the
// header, just before the theme toggle.
export default function HeaderGithubButton() {
  return (
    <Button
      as="a"
      href="https://github.com/daveycodez/heroui-solid"
      rel="noopener noreferrer"
      target="_blank"
      variant="tertiary"
    >
      <GitHubIcon class="text-foreground" />
      <span class="text-muted">GitHub</span>
    </Button>
  )
}
