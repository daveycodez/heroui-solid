import {
  type AlertDialogVariants,
  alertDialogVariants,
  cn
} from "@heroui/styles"
import {
  Content as AlertDialogContentPrimitive,
  Description as AlertDialogDescriptionPrimitive,
  Overlay as AlertDialogOverlayPrimitive,
  Portal as AlertDialogPortalPrimitive,
  Root as AlertDialogPrimitive,
  Title as AlertDialogTitlePrimitive
} from "@kobalte/core/alert-dialog"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { callHandler } from "@kobalte/utils"
import {
  createContext,
  createMemo,
  createSignal,
  type JSX,
  Match,
  onCleanup,
  onMount,
  Switch,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { setupInteractionModality } from "../../utils/interaction-modality"
import { OverlayTriggerContext } from "../../utils/overlay-trigger-context"
import { PreventScroll } from "../../utils/prevent-scroll"
import { CloseButtonRoot } from "../close-button/close-button"
import { DangerIcon, InfoIcon, SuccessIcon, WarningIcon } from "../icons"

type AlertDialogPlacement = "auto" | "top" | "center" | "bottom"
type AlertDialogStatus = "default" | "accent" | "success" | "warning" | "danger"

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Contexts
 * -----------------------------------------------------------------------------------------------*/
// Open state shared between the trigger (AlertDialog.Root) and the overlay
// (AlertDialog.Backdrop) — the Backdrop can also own it when used standalone.
type AlertDialogStateContextValue = {
  isOpen: () => boolean
  setOpen: (open: boolean) => void
}

const AlertDialogStateContext = createContext<AlertDialogStateContextValue>()

// Dismiss behavior lives on the Backdrop but is applied on the Dialog (Kobalte
// exposes it through Content's preventable interact-outside / escape handlers).
type AlertDialogDismissContextValue = {
  isDismissable: () => boolean
  isKeyboardDismissDisabled: () => boolean
}

const AlertDialogDismissContext =
  createContext<AlertDialogDismissContextValue>()

// Placement/size chosen on the Container, consumed by the Dialog's slot class
// and the directional entrance animation.
type AlertDialogLayoutContextValue = {
  placement: () => AlertDialogPlacement
  size: () => AlertDialogVariants["size"]
}

const AlertDialogLayoutContext = createContext<AlertDialogLayoutContextValue>()

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Root
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogRootProps {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  children?: JSX.Element
}

const AlertDialogRoot = (props: AlertDialogRootProps) => {
  const [local] = splitProps(props, [
    "isOpen",
    "defaultOpen",
    "onOpenChange",
    "children"
  ])
  const [internalOpen, setInternalOpen] = createSignal(
    local.defaultOpen ?? false
  )
  const isControlled = () => local.isOpen !== undefined
  const isOpen = () => (isControlled() ? !!local.isOpen : internalOpen())
  const setOpen = (open: boolean) => {
    if (!isControlled()) setInternalOpen(open)
    local.onOpenChange?.(open)
  }

  return (
    <AlertDialogStateContext.Provider value={{ isOpen, setOpen }}>
      {/* Buttons in the trigger region open the dialog; `slot="close"` closes. */}
      <OverlayTriggerContext.Provider
        value={{
          open: () => setOpen(true),
          close: () => setOpen(false)
        }}
      >
        {local.children}
      </OverlayTriggerContext.Provider>
    </AlertDialogStateContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Trigger
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogTriggerProps {
  class?: string
  children?: JSX.Element
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
  onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
}

const AlertDialogTrigger = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogTriggerProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogTriggerProps, [
    "class",
    "onClick",
    "onKeyDown"
  ])
  const overlay = useContext(OverlayTriggerContext)
  const slots = createMemo(() => alertDialogVariants())
  // Modality tracker gates the trigger's keyboard-only focus ring.
  onMount(setupInteractionModality)

  const handleClick: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    callHandler(event, local.onClick)
    if (!event.defaultPrevented) overlay.open?.()
  }

  const handleKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (
    event
  ) => {
    callHandler(event, local.onKeyDown)
    if (event.defaultPrevented) return
    // A native button already synthesizes a click on Enter/Space (handled by
    // on:click); only non-button elements (the default role="button" div) need
    // manual activation.
    if (event.currentTarget instanceof HTMLButtonElement) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      overlay.open?.()
    }
  }

  return (
    <Polymorphic
      as="div"
      class={cn(slots().trigger(), local.class)}
      data-slot="alert-dialog-trigger"
      role="button"
      tabindex={0}
      on:click={handleClick}
      on:keydown={handleKeyDown}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Backdrop
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogBackdropProps {
  variant?: AlertDialogVariants["variant"]
  /** Close when interacting outside the dialog. Defaults to `false`. */
  isDismissable?: boolean
  /** Disable Escape-to-close. Defaults to `true`. */
  isKeyboardDismissDisabled?: boolean
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Render into a custom container instead of `document.body`. */
  UNSTABLE_portalContainer?: Node
  class?: string
  children?: JSX.Element
}

const AlertDialogBackdrop = (props: AlertDialogBackdropProps) => {
  const [local, rest] = splitProps(props, [
    "variant",
    "isDismissable",
    "isKeyboardDismissDisabled",
    "isOpen",
    "defaultOpen",
    "onOpenChange",
    "UNSTABLE_portalContainer",
    "class",
    "children"
  ])
  // Open state: the Backdrop's own `isOpen` (controlled) wins; otherwise it
  // rides the enclosing Root, or its own internal signal when standalone.
  const rootState = useContext(AlertDialogStateContext)
  const [internalOpen, setInternalOpen] = createSignal(
    local.defaultOpen ?? false
  )
  const isControlled = () => local.isOpen !== undefined
  const isOpen = () => {
    if (isControlled()) return !!local.isOpen
    if (rootState) return rootState.isOpen()
    return internalOpen()
  }
  const setOpen = (open: boolean) => {
    local.onOpenChange?.(open)
    if (isControlled()) return
    if (rootState) rootState.setOpen(open)
    else setInternalOpen(open)
  }

  const slots = createMemo(() =>
    alertDialogVariants({ variant: local.variant })
  )
  const isDismissable = () => local.isDismissable ?? false
  const isKeyboardDismissDisabled = () =>
    local.isKeyboardDismissDisabled ?? true

  return (
    <AlertDialogPrimitive
      open={isOpen()}
      onOpenChange={setOpen}
      modal
      // Kobalte's scroll lock targets body, breaking sticky layout; the html-
      // targeted PreventScroll below replaces it (see AGENTS.md).
      preventScroll={false}
    >
      <AlertDialogPortalPrimitive mount={local.UNSTABLE_portalContainer}>
        <AlertDialogOverlayPrimitive
          class={cn(slots().backdrop(), local.class)}
          data-slot="alert-dialog-backdrop"
          {...rest}
        >
          <PreventScroll />
          {/* Contexts live inside the portal so nothing resolves the dialog
              content while the overlay is closed (a Provider deep-resolves its
              children — see AGENTS.md hydration rules). */}
          <AlertDialogDismissContext.Provider
            value={{ isDismissable, isKeyboardDismissDisabled }}
          >
            {/* Footer/close buttons dismiss the dialog but never reopen it. */}
            <OverlayTriggerContext.Provider
              value={{ close: () => setOpen(false) }}
            >
              {local.children}
            </OverlayTriggerContext.Provider>
          </AlertDialogDismissContext.Provider>
        </AlertDialogOverlayPrimitive>
      </AlertDialogPortalPrimitive>
    </AlertDialogPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Container
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogContainerProps {
  placement?: AlertDialogPlacement
  size?: AlertDialogVariants["size"]
  class?: string
  children?: JSX.Element
}

const AlertDialogContainer = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogContainerProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogContainerProps, [
    "placement",
    "size",
    "class"
  ])
  const placement = () => local.placement ?? "auto"
  const size = () => local.size
  const slots = createMemo(() => alertDialogVariants())

  // Kobalte stamps presence attributes (data-expanded / data-closed) only on
  // the Overlay it owns; mirror them from the enclosing backdrop so
  // container-level entrance/exit animations (data-[expanded]/data-[closed])
  // fire here too. Client-only — the container renders only inside the open
  // portal.
  const mirrorPresence = (node: HTMLElement) => {
    onMount(() => {
      const backdrop = node.closest('[data-slot="alert-dialog-backdrop"]')
      if (!backdrop) return
      const sync = () => {
        for (const attr of ["data-expanded", "data-closed"] as const) {
          const value = backdrop.getAttribute(attr)
          if (value === null) node.removeAttribute(attr)
          else node.setAttribute(attr, value)
        }
      }
      sync()
      const observer = new MutationObserver(sync)
      observer.observe(backdrop, {
        attributeFilter: ["data-expanded", "data-closed"]
      })
      onCleanup(() => observer.disconnect())
    })
  }

  return (
    <AlertDialogLayoutContext.Provider value={{ placement, size }}>
      <Polymorphic
        as="div"
        ref={mirrorPresence}
        class={cn(slots().container(), local.class)}
        data-placement={placement()}
        data-slot="alert-dialog-container"
        {...rest}
      />
    </AlertDialogLayoutContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Dialog
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogDialogProps {
  class?: string
  children?: JSX.Element | ((state: { close: () => void }) => JSX.Element)
}

const AlertDialogDialog = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogDialogProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogDialogProps, [
    "class",
    "children"
  ])
  const layout = useContext(AlertDialogLayoutContext)
  const dismiss = useContext(AlertDialogDismissContext)
  const overlay = useContext(OverlayTriggerContext)
  const slots = createMemo(() => alertDialogVariants({ size: layout?.size() }))

  // Render-prop children receive `close`; single read (AGENTS.md), and only
  // ever evaluated inside the open portal.
  const resolveChildren = () => {
    const children = local.children
    return typeof children === "function"
      ? children({ close: () => overlay.close?.() })
      : children
  }

  return (
    <AlertDialogContentPrimitive
      class={cn(slots().dialog(), local.class)}
      data-placement={layout?.placement()}
      data-slot="alert-dialog-dialog"
      onEscapeKeyDown={(event) => {
        if (dismiss?.isKeyboardDismissDisabled()) event.preventDefault()
      }}
      onInteractOutside={(event) => {
        if (!dismiss?.isDismissable()) event.preventDefault()
      }}
      {...rest}
    >
      {resolveChildren()}
    </AlertDialogContentPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Header
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogHeaderProps {
  class?: string
  children?: JSX.Element
}

const AlertDialogHeader = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogHeaderProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogHeaderProps, ["class"])
  const slots = createMemo(() => alertDialogVariants())

  return (
    <Polymorphic
      as="div"
      class={cn(slots().header(), local.class)}
      data-slot="alert-dialog-header"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Heading
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogHeadingProps {
  class?: string
  children?: JSX.Element
}

const AlertDialogHeading = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, AlertDialogHeadingProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogHeadingProps, ["class"])
  const slots = createMemo(() => alertDialogVariants())

  return (
    <AlertDialogTitlePrimitive
      as="h2"
      class={cn(slots().heading(), local.class)}
      data-slot="alert-dialog-heading"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Body
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogBodyProps {
  class?: string
  children?: JSX.Element
}

const AlertDialogBody = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogBodyProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogBodyProps, ["class"])
  const slots = createMemo(() => alertDialogVariants())

  // Kobalte's Description registers the dialog's aria-describedby (paired with
  // Heading → Title's aria-labelledby), completing the WAI-ARIA alertdialog
  // wiring — rendered as a div to match upstream's body markup.
  return (
    <AlertDialogDescriptionPrimitive
      as="div"
      class={cn(slots().body(), local.class)}
      data-slot="alert-dialog-body"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Footer
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogFooterProps {
  class?: string
  children?: JSX.Element
}

const AlertDialogFooter = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogFooterProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogFooterProps, ["class"])
  const slots = createMemo(() => alertDialogVariants())

  return (
    <Polymorphic
      as="div"
      class={cn(slots().footer(), local.class)}
      data-slot="alert-dialog-footer"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Icon
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogIconProps {
  /** Status color and default icon. Defaults to `"danger"`. */
  status?: AlertDialogStatus
  class?: string
  children?: JSX.Element
}

// Switch/Match keeps the choice reactive to status changes (a bare switch in
// the component body reads status only once).
const DefaultIcon = (props: { status: AlertDialogStatus }) => (
  <Switch fallback={<InfoIcon data-slot="alert-dialog-default-icon" />}>
    <Match when={props.status === "success"}>
      <SuccessIcon data-slot="alert-dialog-default-icon" />
    </Match>
    <Match when={props.status === "warning"}>
      <WarningIcon data-slot="alert-dialog-default-icon" />
    </Match>
    <Match when={props.status === "danger"}>
      <DangerIcon data-slot="alert-dialog-default-icon" />
    </Match>
  </Switch>
)

const AlertDialogIcon = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertDialogIconProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogIconProps, [
    "status",
    "class",
    "children"
  ])
  const status = () => local.status ?? "danger"
  const slots = createMemo(() => alertDialogVariants({ status: status() }))

  return (
    <Polymorphic
      as="div"
      class={cn(slots().icon(), local.class)}
      data-slot="alert-dialog-icon"
      {...rest}
    >
      {local.children ?? <DefaultIcon status={status()} />}
    </Polymorphic>
  )
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Close Trigger
 * -----------------------------------------------------------------------------------------------*/
interface AlertDialogCloseTriggerProps {
  class?: string
  children?: JSX.Element
}

const AlertDialogCloseTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, AlertDialogCloseTriggerProps>
) => {
  const [local, rest] = splitProps(props as AlertDialogCloseTriggerProps, [
    "class"
  ])
  const slots = createMemo(() => alertDialogVariants())

  return (
    <CloseButtonRoot
      class={cn(slots().closeTrigger(), local.class)}
      data-slot="alert-dialog-close-trigger"
      {...rest}
    />
  )
}

export type {
  AlertDialogBackdropProps,
  AlertDialogBodyProps,
  AlertDialogCloseTriggerProps,
  AlertDialogContainerProps,
  AlertDialogDialogProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogHeadingProps,
  AlertDialogIconProps,
  AlertDialogPlacement,
  AlertDialogRootProps,
  AlertDialogStatus,
  AlertDialogTriggerProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot,
  AlertDialogTrigger
}
