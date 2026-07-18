import { Link } from "heroui-solid"

export function LinkUnderlineOffset() {
  return (
    <div class="flex flex-col gap-4">
      <Link class="underline-offset-1" href="#">
        Offset 1
        <Link.Icon />
      </Link>
      <Link class="underline-offset-2" href="#">
        Offset 2
        <Link.Icon />
      </Link>
      <Link class="underline-offset-3" href="#">
        Offset 3
        <Link.Icon />
      </Link>
    </div>
  )
}
