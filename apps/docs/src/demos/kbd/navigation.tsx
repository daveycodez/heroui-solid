import { Kbd } from "heroui-solid"

export function NavigationKeys() {
  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">Arrow Keys:</span>
        <div class="flex items-center gap-2">
          <Kbd>
            <Kbd.Abbr keyValue="up" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="down" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="left" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="right" />
          </Kbd>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">Page Navigation:</span>
        <div class="flex items-center gap-2">
          <Kbd>
            <Kbd.Abbr keyValue="pageup" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="pagedown" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="home" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="end" />
          </Kbd>
        </div>
      </div>
    </div>
  )
}
