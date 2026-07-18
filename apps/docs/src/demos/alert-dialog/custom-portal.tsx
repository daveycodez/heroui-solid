import { AlertDialog, Button } from "heroui-solid"
import { createSignal, onMount, Show } from "solid-js"

export function CustomPortal() {
  const [portalContainer, setPortalContainer] =
    createSignal<HTMLElement | null>(null)
  let containerRef: HTMLDivElement | undefined
  // Publish the container only after mount — setting the signal from the ref
  // during hydration would flip the Show open and desync (see AGENTS.md).
  onMount(() => setPortalContainer(containerRef ?? null))

  return (
    <div class="flex flex-col gap-4">
      <div>
        <p class="text-sm">
          Render alert dialogs inside a custom container instead of{" "}
          <code>document.body</code>
        </p>
        <p class="text-sm text-muted">
          Apply{" "}
          <code class="rounded px-1 py-0.5 text-xs">
            transform: translateZ(0)
          </code>{" "}
          to the container to create a new stacking context.
        </p>
      </div>
      <div
        ref={containerRef}
        class="relative flex h-[380px] items-center justify-center overflow-hidden rounded bg-muted/20"
        // new stacking context
        style={{ transform: "translate(0)" }}
      >
        <Show when={portalContainer()}>
          <AlertDialog>
            <Button>Open Alert Dialog</Button>
            <AlertDialog.Backdrop
              class="h-full"
              UNSTABLE_portalContainer={portalContainer()!}
            >
              <AlertDialog.Container class="h-full max-h-full">
                <AlertDialog.Dialog class="h-full max-h-full sm:max-w-md">
                  <AlertDialog.CloseTrigger />
                  <AlertDialog.Header>
                    <AlertDialog.Icon status="accent" />
                    <AlertDialog.Heading>Custom Portal</AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>
                    <p class="text-sm text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p class="text-sm text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p class="text-sm text-muted">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
        </Show>
      </div>
    </div>
  )
}
