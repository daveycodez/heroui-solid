import {
  cn,
  type DropdownVariants,
  dropdownVariants,
  menuSectionVariants
} from "@heroui/styles"
import {
  Content as DropdownContentPrimitive,
  Group as DropdownGroupPrimitive,
  Portal as DropdownPortalPrimitive,
  Root as DropdownPrimitive,
  SubContent as DropdownSubContentPrimitive,
  Sub as DropdownSubPrimitive,
  Trigger as DropdownTriggerPrimitive
} from "@kobalte/core/dropdown-menu"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeRefs } from "@kobalte/utils"
import {
  type ComponentProps,
  createComputed,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  onCleanup,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import {
  createLongPressHandlers,
  MenuTriggerBehaviorContext,
  MenuTriggerContext
} from "../../utils/menu-trigger-context"
import { PreventScroll } from "../../utils/prevent-scroll"
import {
  createSelectionContextValue,
  MenuContext,
  MenuItemIndicator,
  type MenuItemIndicatorProps,
  MenuItemRoot,
  type MenuItemRootProps,
  MenuItemSubmenuIndicator,
  type MenuItemSubmenuIndicatorProps,
  SelectionContext,
  type SelectionProps,
  SubmenuTriggerContext
} from "../menu-item/menu-item"
import { SurfaceContext } from "../surface/surface"

type DropdownPrimitiveProps = ComponentProps<typeof DropdownPrimitive>
type DropdownPopoverPlacement = DropdownPrimitiveProps["placement"]

// The popper writes its transform origin opposite the resolved side.
const SIDE_FROM_ORIGIN: Record<string, string> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Context
 * -----------------------------------------------------------------------------------------------*/
type DropdownContextValue = {
  slots?: ReturnType<typeof dropdownVariants>
  setPlacement?: (placement: DropdownPopoverPlacement) => void
}

const DropdownContext = createContext<DropdownContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Dropdown Root (MenuTrigger wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownRootProps extends DropdownVariants {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  trigger?: "press" | "longPress"
  children?: JSX.Element
}

const DropdownRoot = (props: DropdownRootProps) => {
  const [local, rest] = splitProps(props, [
    "isOpen",
    "defaultOpen",
    "onOpenChange",
    "trigger",
    "children"
  ])
  const slots = createMemo(() => dropdownVariants())
  const [placement, setPlacement] =
    createSignal<DropdownPopoverPlacement>("bottom")

  // Long-press triggers bypass Kobalte's press-to-open (see
  // utils/menu-trigger-context.tsx), so the root drives Kobalte's open state
  // itself while trigger="longPress".
  const [internalOpen, setInternalOpen] = createSignal(
    local.defaultOpen ?? false
  )
  const isLongPress = () => local.trigger === "longPress"
  const isOpen = () => local.isOpen ?? internalOpen()
  const openMenu = () => {
    if (isOpen()) return
    setInternalOpen(true)
    local.onOpenChange?.(true)
  }

  return (
    <DropdownContext.Provider
      value={{
        get slots() {
          return slots()
        },
        setPlacement
      }}
    >
      <DropdownPrimitive
        open={local.isOpen ?? (isLongPress() ? internalOpen() : undefined)}
        defaultOpen={local.defaultOpen}
        onOpenChange={(open) => {
          setInternalOpen(open)
          local.onOpenChange?.(open)
        }}
        placement={placement()}
        // Kobalte's scroll lock targets body, breaking sticky headers; the
        // popover applies an html-targeted PreventScroll instead.
        preventScroll={false}
        {...rest}
      >
        <MenuTriggerContext.Provider value={true}>
          <MenuTriggerBehaviorContext.Provider
            value={{
              get trigger() {
                return local.trigger ?? "press"
              },
              get isOpen() {
                return isOpen()
              },
              open: openMenu
            }}
          >
            {local.children}
          </MenuTriggerBehaviorContext.Provider>
        </MenuTriggerContext.Provider>
      </DropdownPrimitive>
    </DropdownContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Trigger (Button wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownTriggerProps {
  class?: string
  children?: JSX.Element
}

const DropdownTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DropdownTriggerProps>
) => {
  const [local, rest] = splitProps(props as DropdownTriggerProps, ["class"])
  const context = useContext(DropdownContext)
  const behavior = useContext(MenuTriggerBehaviorContext)
  const longPress = createLongPressHandlers(behavior)

  return (
    <DropdownTriggerPrimitive
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="dropdown-trigger"
      on:pointerdown={longPress.onPointerDown}
      on:pointerup={longPress.onPointerUp}
      on:pointerleave={longPress.onPointerLeave}
      on:pointercancel={longPress.onPointerCancel}
      on:click={longPress.onClick}
      on:keydown={longPress.onKeyDown}
      on:contextmenu={longPress.onContextMenu}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Popover (Popover wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownPopoverProps {
  class?: string
  children?: JSX.Element
  placement?: DropdownPopoverPlacement
}

const DropdownPopover = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownPopoverProps>
) => {
  const [local, rest] = splitProps(
    props as DropdownPopoverProps & {
      ref?: HTMLElement | ((el: HTMLElement) => void)
    },
    ["class", "children", "placement", "ref"]
  )
  const context = useContext(DropdownContext)
  // Inside Dropdown.SubmenuTrigger the same component renders Kobalte's
  // submenu content instead of the root menu content.
  const isSubmenu = useContext(SubmenuTriggerContext)
  const [contentEl, setContentEl] = createSignal<HTMLElement>()
  const [resolvedSide, setResolvedSide] = createSignal<string>()

  createComputed(() => {
    if (!isSubmenu && local.placement) {
      context.setPlacement?.(local.placement)
    }
  })

  // Kobalte's Menu omits onCurrentPlacementChange, so the popper-resolved
  // side (which reflects viewport flips) is only observable through the
  // transform-origin var written on the positioner — mirror it into the
  // data-placement attribute upstream's directional animations key off.
  createEffect(() => {
    const positioner = contentEl()?.parentElement
    if (!positioner) return
    const update = () => {
      const origin = positioner.style.getPropertyValue(
        "--kb-popper-content-transform-origin"
      )
      setResolvedSide(SIDE_FROM_ORIGIN[origin.trim().split(" ")[0] ?? ""])
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(positioner, { attributeFilter: ["style"] })
    onCleanup(() => observer.disconnect())
  })

  const ContentPrimitive = isSubmenu
    ? DropdownSubContentPrimitive
    : DropdownContentPrimitive
  const defaultSide = () =>
    isSubmenu ? "right" : (local.placement ?? "bottom").split("-")[0]

  return (
    <SurfaceContext.Provider value={{ variant: "default" }}>
      {/* Buttons inside the popover are plain buttons, not triggers. */}
      <MenuTriggerContext.Provider value={false}>
        <SubmenuTriggerContext.Provider value={false}>
          <DropdownPortalPrimitive>
            <ContentPrimitive
              ref={mergeRefs(setContentEl, local.ref)}
              class={cn(context.slots?.popover(), local.class)}
              data-slot="dropdown-popover"
              data-placement={resolvedSide() ?? defaultSide()}
              {...rest}
            >
              <PreventScroll />
              {local.children}
            </ContentPrimitive>
          </DropdownPortalPrimitive>
        </SubmenuTriggerContext.Provider>
      </MenuTriggerContext.Provider>
    </SurfaceContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Section
 * -----------------------------------------------------------------------------------------------*/
interface DropdownSectionProps extends SelectionProps {
  disabledKeys?: Iterable<string>
  class?: string
  children?: JSX.Element
}

const DropdownSection = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownSectionProps>
) => {
  const [local, rest] = splitProps(props as DropdownSectionProps, [
    "class",
    "selectionMode",
    "selectedKeys",
    "defaultSelectedKeys",
    "onSelectionChange",
    "disabledKeys"
  ])
  const menuContext = useContext(MenuContext)
  const parentSelection = useContext(SelectionContext)
  const sectionSelection = createSelectionContextValue(local)
  // Section-level selection (React Aria's MenuSection): a section with its
  // own selectionMode scopes selection to its items; otherwise items keep
  // participating in the menu-level selection.
  const hasOwnSelection = () => local.selectionMode != null

  return (
    <MenuContext.Provider
      value={{
        get onAction() {
          return menuContext.onAction
        },
        get disabledKeys() {
          if (!local.disabledKeys) return menuContext.disabledKeys
          return [...(menuContext.disabledKeys ?? []), ...local.disabledKeys]
        }
      }}
    >
      <SelectionContext.Provider
        value={{
          get selectionMode() {
            return hasOwnSelection()
              ? sectionSelection.selectionMode
              : (parentSelection?.selectionMode ?? "none")
          },
          isSelected: (key) =>
            hasOwnSelection()
              ? sectionSelection.isSelected(key)
              : (parentSelection?.isSelected(key) ?? false),
          select: (key) => {
            if (hasOwnSelection()) {
              sectionSelection.select(key)
            } else {
              parentSelection?.select(key)
            }
          }
        }}
      >
        <DropdownGroupPrimitive
          class={cn(menuSectionVariants(), local.class)}
          data-slot="dropdown-section"
          {...rest}
        />
      </SelectionContext.Provider>
    </MenuContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Menu (Menu wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownMenuProps extends SelectionProps {
  onAction?: (key: string) => void
  disabledKeys?: Iterable<string>
  class?: string
  children?: JSX.Element
}

const DropdownMenu = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuProps>
) => {
  const [local, rest] = splitProps(props as DropdownMenuProps, [
    "onAction",
    "disabledKeys",
    "selectionMode",
    "selectedKeys",
    "defaultSelectedKeys",
    "onSelectionChange",
    "class"
  ])
  const context = useContext(DropdownContext)
  const selection = createSelectionContextValue(local)

  return (
    <MenuContext.Provider
      value={{
        get onAction() {
          return local.onAction
        },
        get disabledKeys() {
          return local.disabledKeys
        }
      }}
    >
      <SelectionContext.Provider value={selection}>
        <Polymorphic
          as="div"
          class={cn(context.slots?.menu(), local.class)}
          data-selection-mode={local.selectionMode}
          data-slot="dropdown-menu"
          role="presentation"
          {...rest}
        />
      </SelectionContext.Provider>
    </MenuContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item (MenuItem wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownItemProps extends MenuItemRootProps {}

const DropdownItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownItemProps>
) => {
  return <MenuItemRoot {...(props as DropdownItemProps)} />
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Submenu Indicator (MenuItemSubmenuIndicator wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownSubmenuIndicatorProps extends MenuItemSubmenuIndicatorProps {}

const DropdownSubmenuIndicator = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, DropdownSubmenuIndicatorProps>
) => {
  return (
    <MenuItemSubmenuIndicator {...(props as DropdownSubmenuIndicatorProps)} />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Submenu Trigger
 * -----------------------------------------------------------------------------------------------*/
interface DropdownSubmenuTriggerProps {
  children?: JSX.Element
}

const DropdownSubmenuTrigger = (props: DropdownSubmenuTriggerProps) => {
  const [local, rest] = splitProps(props, ["children"])

  return (
    <DropdownSubPrimitive {...rest}>
      <SubmenuTriggerContext.Provider value={true}>
        {local.children}
      </SubmenuTriggerContext.Provider>
    </DropdownSubPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item Indicator (MenuItemIndicator wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownItemIndicatorProps extends MenuItemIndicatorProps {}

const DropdownItemIndicator = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, DropdownItemIndicatorProps>
) => {
  return <MenuItemIndicator {...(props as DropdownItemIndicatorProps)} />
}

export type {
  DropdownContextValue,
  DropdownItemIndicatorProps,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopoverProps,
  DropdownRootProps,
  DropdownSectionProps,
  DropdownSubmenuIndicatorProps,
  DropdownSubmenuTriggerProps,
  DropdownTriggerProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  DropdownContext,
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger
}
