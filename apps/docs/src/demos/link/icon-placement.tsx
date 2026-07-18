import { Link } from "heroui-solid"

export function LinkIconPlacement() {
  return (
    <div class="flex flex-col gap-3">
      <Link href="#">
        Icon at end (default)
        <Link.Icon />
      </Link>
      <Link class="gap-1" href="#">
        <Link.Icon />
        Icon at start
      </Link>
    </div>
  )
}
