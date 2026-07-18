import { Kbd } from "heroui-solid"

export function SpecialKeys() {
  return (
    <div class="space-y-3">
      <p class="text-sm">
        Press{" "}
        <Kbd>
          <Kbd.Abbr keyValue="enter" />
        </Kbd>{" "}
        to confirm or{" "}
        <Kbd>
          <Kbd.Abbr keyValue="escape" />
        </Kbd>{" "}
        to cancel.
      </p>
      <p class="text-sm">
        Use{" "}
        <Kbd>
          <Kbd.Abbr keyValue="tab" />
        </Kbd>{" "}
        to navigate between form fields and{" "}
        <Kbd>
          <Kbd.Abbr keyValue="shift" />
          <Kbd.Abbr keyValue="tab" />
        </Kbd>{" "}
        to go back.
      </p>
      <p class="text-sm">
        Hold{" "}
        <Kbd>
          <Kbd.Abbr keyValue="space" />
        </Kbd>{" "}
        to temporarily enable panning mode.
      </p>
    </div>
  )
}
