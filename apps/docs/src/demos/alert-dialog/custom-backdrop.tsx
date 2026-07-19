import { TriangleExclamation } from "gravity-icons-solid"
import { AlertDialog, Button } from "heroui-solid"

export function CustomBackdrop() {
  return (
    <AlertDialog>
      <Button variant="danger">Delete Account</Button>
      <AlertDialog.Backdrop
        class="bg-linear-to-t from-red-950/90 via-red-950/50 to-transparent dark:from-red-950/95 dark:via-red-950/60"
        variant="blur"
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog class="sm:max-w-[420px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header class="items-center text-center">
              <AlertDialog.Icon status="danger">
                <TriangleExclamation class="size-5" />
              </AlertDialog.Icon>
              <AlertDialog.Heading>
                Permanently delete your account?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This action cannot be undone. All your data, settings, and
                content will be permanently removed from our servers. The
                dramatic red backdrop emphasizes the severity and
                irreversibility of this decision.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer class="flex-col-reverse">
              <Button class="w-full" slot="close">
                Keep Account
              </Button>
              <Button class="w-full" slot="close" variant="danger">
                Delete Forever
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  )
}
