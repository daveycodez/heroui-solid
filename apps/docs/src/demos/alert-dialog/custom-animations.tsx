import { ArrowUpFromLine, Sparkles } from "gravity-icons-solid"
import { AlertDialog, Button } from "heroui-solid"
import type { Component } from "solid-js"

const iconMap: Record<string, Component<{ class?: string }>> = {
  "gravity-ui:arrow-up-from-line": ArrowUpFromLine,
  "gravity-ui:sparkles": Sparkles
}

export function CustomAnimations() {
  const animations = [
    {
      classNames: {
        backdrop: [
          "data-[expanded]:duration-400",
          "data-[expanded]:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[closed]:duration-200",
          "data-[closed]:ease-[cubic-bezier(0.7,0,0.84,0)]"
        ].join(" "),
        container: [
          "data-[expanded]:animate-in",
          "data-[expanded]:fade-in-0",
          "data-[expanded]:zoom-in-95",
          "data-[expanded]:duration-400",
          "data-[expanded]:ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[closed]:animate-out",
          "data-[closed]:fade-out-0",
          "data-[closed]:zoom-out-95",
          "data-[closed]:duration-200",
          "data-[closed]:ease-[cubic-bezier(0.7,0,0.84,0)]"
        ].join(" ")
      },
      description:
        "Physics-based elastic scaling. Simulates a high-damping spring system with fast transient response and prolonged settling time. Ideal for Alert Dialogs and Modals.",
      icon: "gravity-ui:sparkles",
      name: "Kinematic Scale"
    },
    {
      classNames: {
        backdrop: [
          "data-[expanded]:duration-500",
          "data-[expanded]:ease-[cubic-bezier(0.25,1,0.5,1)]",
          "data-[closed]:duration-200",
          "data-[closed]:ease-[cubic-bezier(0.5,0,0.75,0)]"
        ].join(" "),
        container: [
          "data-[expanded]:animate-in",
          "data-[expanded]:fade-in-0",
          "data-[expanded]:slide-in-from-bottom-4",
          "data-[expanded]:duration-500",
          "data-[expanded]:ease-[cubic-bezier(0.25,1,0.5,1)]",
          "data-[closed]:animate-out",
          "data-[closed]:fade-out-0",
          "data-[closed]:slide-out-to-bottom-2",
          "data-[closed]:duration-200",
          "data-[closed]:ease-[cubic-bezier(0.5,0,0.75,0)]"
        ].join(" ")
      },
      description:
        "Simulates movement through a medium with fluid resistance. Eliminates mechanical linearity for a natural, grounded feel. Perfect for Bottom Sheets or Toasts.",
      icon: "gravity-ui:arrow-up-from-line",
      name: "Fluid Slide"
    }
  ]

  return (
    <div class="flex flex-wrap gap-4">
      {animations.map(({ classNames, description, icon, name }) => {
        const IconComponent = iconMap[icon]

        return (
          <AlertDialog>
            <Button variant="secondary">{name}</Button>
            <AlertDialog.Backdrop class={classNames.backdrop}>
              <AlertDialog.Container class={classNames.container}>
                <AlertDialog.Dialog class="sm:max-w-[400px]">
                  <AlertDialog.CloseTrigger />
                  <AlertDialog.Header>
                    <AlertDialog.Icon status="accent">
                      {!!IconComponent && <IconComponent class="size-5" />}
                    </AlertDialog.Icon>
                    <AlertDialog.Heading>{name} Animation</AlertDialog.Heading>
                  </AlertDialog.Header>
                  <AlertDialog.Body>
                    <p class="mt-1">{description}</p>
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button slot="close" variant="tertiary">
                      Close
                    </Button>
                    <Button slot="close">Try Again</Button>
                  </AlertDialog.Footer>
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        )
      })}
    </div>
  )
}
