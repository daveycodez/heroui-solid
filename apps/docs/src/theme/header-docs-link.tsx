import { useMatch } from "@solidjs/router"
import { Link } from "heroui-solid"
import { Show } from "solid-js"
import { withBase } from "./base"

// Rendered into solidbase's VersionSelector slot — the only header slot
// inside the logo cluster (see Layout.tsx) — to put the Docs link on the
// left next to the logo like the official HeroUI docs header. Shown only
// outside the docs section; the sidebar covers navigation once you're in.
// No version axis is configured, so the default selector renders nothing
// here.
export default function HeaderDocsLink() {
  const match = useMatch(() => withBase("/docs/*rest"))
  return (
    <Show when={match() === undefined}>
      {/* logo-cluster's own gap is 0.65rem; ml-3.5 tops it up to the
          official ~24px between logo and nav links. */}
      <Link
        class="ml-4 text-muted no-underline"
        href={withBase("/docs/getting-started")}
      >
        Docs
      </Link>
    </Show>
  )
}
