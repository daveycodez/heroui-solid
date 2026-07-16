import { cn, type DropdownVariants, dropdownVariants } from "@heroui/styles"
import {
  Content as DropdownContentPrimitive,
  Portal as DropdownPortalPrimitive,
  Root as DropdownPrimitive,
  Trigger as DropdownTriggerPrimitive
} from "@kobalte/core/dropdown-menu"
import {
  type ComponentProps,
  createComputed,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  splitProps,
  useContext
} from "solid-js"

import { MenuContext, MenuItemRoot } from "../menu-item/menu-item"
import { SurfaceContext } from "../surface/surface"

type DropdownPrimitiveProps = ComponentProps<typeof DropdownPrimitive>
type DropdownPopoverPlacement = DropdownPrimitiveProps["placement"]

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
  children?: JSX.Element
}

const DropdownRoot = (props: DropdownRootProps) => {
  const [local, rest] = splitProps(props, ["isOpen"])
  const slots = createMemo(() => dropdownVariants())
  const [placement, setPlacement] =
    createSignal<DropdownPopoverPlacement>("bottom")

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
        open={local.isOpen}
        placement={placement()}
        {...rest}
      />
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

const DropdownTrigger = (props: DropdownTriggerProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const context = useContext(DropdownContext)

  return (
    <DropdownTriggerPrimitive
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="dropdown-trigger"
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

const DropdownPopover = (props: DropdownPopoverProps) => {
  const [local, rest] = splitProps(props, ["class", "placement"])
  const context = useContext(DropdownContext)

  createComputed(() => {
    if (local.placement) {
      context.setPlacement?.(local.placement)
    }
  })

  return (
    <SurfaceContext.Provider value={{ variant: "default" }}>
      <DropdownPortalPrimitive>
        <DropdownContentPrimitive
          class={cn(context.slots?.popover(), local.class)}
          data-slot="dropdown-popover"
          {...rest}
        />
      </DropdownPortalPrimitive>
    </SurfaceContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Menu (Menu wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownMenuProps {
  onAction?: (key: string) => void
  disabledKeys?: Iterable<string>
  class?: string
  children?: JSX.Element
}

const DropdownMenu = (props: DropdownMenuProps) => {
  const [local, rest] = splitProps(props, ["onAction", "disabledKeys", "class"])
  const context = useContext(DropdownContext)

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
      <div
        class={cn(context.slots?.menu(), local.class)}
        data-slot="dropdown-menu"
        role="presentation"
        {...rest}
      />
    </MenuContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item (MenuItem wrapper)
 * -----------------------------------------------------------------------------------------------*/
interface DropdownItemProps extends ComponentProps<typeof MenuItemRoot> {}

const DropdownItem = (props: DropdownItemProps) => {
  return <MenuItemRoot {...props} />
}

export type {
  DropdownContextValue,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopoverProps,
  DropdownRootProps,
  DropdownTriggerProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  DropdownContext,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownTrigger
}
