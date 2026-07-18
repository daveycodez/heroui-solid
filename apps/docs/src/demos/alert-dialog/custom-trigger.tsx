import { TrashBin } from "gravity-icons-solid"
import { AlertDialog, Button } from "heroui-solid"

export function CustomTrigger() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger class="group flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-xs select-none hover:bg-surface-secondary">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger-soft-foreground">
          <TrashBin class="size-6" />
        </div>
        <div class="flex flex-1 flex-col gap-0.5">
          <p class="text-sm font-semibold">Delete Item</p>
          <p class="text-xs text-muted">Permanently remove this item</p>
        </div>
      </AlertDialog.Trigger>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog class="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger">
                <TrashBin class="size-5" />
              </AlertDialog.Icon>
              <AlertDialog.Heading>Delete this item?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Use <code>AlertDialog.Trigger</code> to create custom trigger
                elements beyond standard buttons. This example shows a
                card-style trigger with icons and descriptive text.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button slot="close" variant="danger">
                Delete Item
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  )
}
