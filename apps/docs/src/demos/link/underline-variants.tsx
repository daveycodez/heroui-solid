import { Link } from "heroui-solid"

export function LinkUnderlineVariants() {
  return (
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Default hover underline</p>
        <Link href="#">
          Hover to see the underline
          <Link.Icon />
        </Link>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">Always visible underline</p>
        <Link class="underline" href="#">
          Underline always visible
          <Link.Icon />
        </Link>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">No underline</p>
        <Link class="no-underline" href="#">
          Link without any underline
          <Link.Icon />
        </Link>
      </div>
    </div>
  )
}
