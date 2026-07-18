// @vitest-environment jsdom

import { fireEvent, render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { ButtonRoot } from "../button/button"
import {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot
} from "./alert-dialog"

const Example = (props: { defaultOpen?: boolean }) => (
  <AlertDialogRoot defaultOpen={props.defaultOpen}>
    <ButtonRoot>Open</ButtonRoot>
    <AlertDialogBackdrop>
      <AlertDialogContainer>
        <AlertDialogDialog>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogHeading>Delete project?</AlertDialogHeading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <p>This cannot be undone.</p>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonRoot slot="close">Cancel</ButtonRoot>
          </AlertDialogFooter>
        </AlertDialogDialog>
      </AlertDialogContainer>
    </AlertDialogBackdrop>
  </AlertDialogRoot>
)

const dialog = () => document.body.querySelector('[role="alertdialog"]')

describe("AlertDialog", () => {
  it("is closed by default — content is not in the DOM", () => {
    render(() => <Example />)
    expect(dialog()).toBeNull()
  })

  it("renders the anatomy with slot classes when open", () => {
    render(() => <Example defaultOpen />)
    const content = dialog() as HTMLElement
    expect(content).not.toBeNull()
    expect(content.classList.contains("alert-dialog__dialog")).toBe(true)

    const parts: Array<[string, string]> = [
      ["alert-dialog-backdrop", "alert-dialog__backdrop"],
      ["alert-dialog-container", "alert-dialog__container"],
      ["alert-dialog-header", "alert-dialog__header"],
      ["alert-dialog-heading", "alert-dialog__heading"],
      ["alert-dialog-body", "alert-dialog__body"],
      ["alert-dialog-footer", "alert-dialog__footer"],
      ["alert-dialog-icon", "alert-dialog__icon"]
    ]
    for (const [slot, className] of parts) {
      const el = document.body.querySelector(
        `[data-slot=${slot}]`
      ) as HTMLElement
      expect(el, slot).not.toBeNull()
      expect(el.classList.contains(className), className).toBe(true)
    }
  })

  it("defaults the icon status to danger with a default icon", () => {
    render(() => <Example defaultOpen />)
    const icon = document.body.querySelector(
      "[data-slot=alert-dialog-icon]"
    ) as HTMLElement
    expect(icon.classList.contains("alert-dialog__icon--danger")).toBe(true)
    expect(
      icon.querySelector('[data-slot="alert-dialog-default-icon"]')
    ).not.toBeNull()
  })

  it("opens when the trigger button is clicked", async () => {
    const { getByText } = render(() => <Example />)
    expect(dialog()).toBeNull()
    fireEvent.click(getByText("Open"))
    await Promise.resolve()
    expect(dialog()).not.toBeNull()
  })

  it('closes when a slot="close" button is clicked', async () => {
    render(() => <Example defaultOpen />)
    expect(dialog()).not.toBeNull()
    // The close button lives in the portal, not the render container.
    const cancel = [...document.body.querySelectorAll("button")].find(
      (b) => b.textContent === "Cancel"
    ) as HTMLButtonElement
    fireEvent.click(cancel)
    await Promise.resolve()
    expect(dialog()).toBeNull()
  })
})
