import { AlertDialog, Button } from "heroui-solid"

export function CloseMethods() {
  return (
    <div class="flex max-w-2xl flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Using slot="close"</h3>
        <p class="text-sm text-muted">
          The simplest way to close a dialog. Add <code>slot="close"</code> to
          any Button component within the dialog. When clicked, it will
          automatically close the dialog.
        </p>
        <AlertDialog>
          <Button variant="secondary">Open Dialog</Button>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog class="sm:max-w-[400px]">
                <AlertDialog.Header>
                  <AlertDialog.Icon status="accent" />
                  <AlertDialog.Heading>Using slot="close"</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p>
                    Click either button below - both have{" "}
                    <code>slot="close"</code> and will close the dialog
                    automatically.
                  </p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button slot="close">Confirm</Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>

      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold">Using Dialog render props</h3>
        <p class="text-sm text-muted">
          Access the <code>close</code> method from the Dialog's render props.
          This gives you full control over when and how to close the dialog,
          allowing you to add custom logic before closing.
        </p>
        <AlertDialog>
          <Button variant="secondary">Open Dialog</Button>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog class="sm:max-w-[400px]">
                {(renderProps) => (
                  <>
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="success" />
                      <AlertDialog.Heading>
                        Using Dialog render props
                      </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <p>
                        The buttons below use the <code>close</code> method from
                        render props. You can add validation or other logic
                        before calling <code>renderProps.close()</code>.
                      </p>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button
                        variant="tertiary"
                        onClick={() => renderProps.close()}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => renderProps.close()}>
                        Confirm
                      </Button>
                    </AlertDialog.Footer>
                  </>
                )}
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      </div>
    </div>
  )
}
