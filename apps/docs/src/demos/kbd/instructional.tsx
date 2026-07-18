import { Kbd } from "heroui-solid"

export function InstructionalText() {
  return (
    <div class="space-y-3">
      <div class="rounded-lg bg-surface p-4">
        <h4 class="mb-2 text-sm font-semibold">Quick Actions</h4>
        <ul class="space-y-2 text-sm">
          <li>
            • Open search:{" "}
            <Kbd>
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>K</Kbd.Content>
            </Kbd>
          </li>
          <li>
            • Toggle sidebar:{" "}
            <Kbd>
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>B</Kbd.Content>
            </Kbd>
          </li>
          <li>
            • New file:{" "}
            <Kbd>
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>N</Kbd.Content>
            </Kbd>
          </li>
          <li>
            • Quick save:{" "}
            <Kbd>
              <Kbd.Abbr keyValue="command" />
              <Kbd.Content>S</Kbd.Content>
            </Kbd>
          </li>
        </ul>
      </div>
    </div>
  )
}
