import { Spinner } from "heroui-solid"

export function SpinnerColors() {
  return (
    <div class="flex items-center gap-8">
      <div class="flex flex-col items-center gap-2">
        <Spinner color="current" />
        <span class="text-xs text-muted">Current</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner color="accent" />
        <span class="text-xs text-muted">Accent</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner color="success" />
        <span class="text-xs text-muted">Success</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner color="warning" />
        <span class="text-xs text-muted">Warning</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner color="danger" />
        <span class="text-xs text-muted">Danger</span>
      </div>
    </div>
  )
}
