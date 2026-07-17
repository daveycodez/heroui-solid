import { Link } from "heroui-solid"

export function LinkUnderlineAndOffset() {
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

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-muted">
          Changing the underline offset
        </p>
        <div class="flex flex-col gap-3">
          <Link class="underline-offset-1" href="#">
            Offset 1 (1px space)
            <Link.Icon />
          </Link>
          <Link class="underline-offset-2" href="#">
            Offset 2 (2px space)
            <Link.Icon />
          </Link>
          <Link class="underline-offset-3" href="#">
            Offset 3 (3px space)
            <Link.Icon />
          </Link>
          <Link class="underline-offset-4" href="#">
            Offset 4 (4px space)
            <Link.Icon />
          </Link>
        </div>
      </div>
    </div>
  )
}
