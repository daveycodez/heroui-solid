import { cn, type DropdownVariants, dropdownVariants } from "@heroui/styles"
import {
  Content as DropdownContentPrimitive,
  Portal as DropdownPortalPrimitive,
  Root as DropdownPrimitive,
  Trigger as DropdownTriggerPrimitive
} from "@kobalte/core/dropdown-menu"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  type ComponentProps,
  createComputed,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { PreventScroll } from "../../utils/prevent-scroll"
import {
  MenuContext,
  MenuItemRoot,
  type MenuItemRootProps
} from "../menu-item/menu-item"
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
        // Kobalte's scroll lock targets body, breaking sticky headers; the
        // popover applies an html-targeted PreventScroll instead.
        preventScroll={false}
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

const DropdownTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, DropdownTriggerProps>
) => {
  const [local, rest] = splitProps(props as DropdownTriggerProps, ["class"])
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

const DropdownPopover = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownPopoverProps>
) => {
  const [local, rest] = splitProps(props as DropdownPopoverProps, [
    "class",
    "children",
    "placement"
  ])
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
        >
          <PreventScroll />
          {local.children}
        </DropdownContentPrimitive>
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

const DropdownMenu = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownMenuProps>
) => {
  const [local, rest] = splitProps(props as DropdownMenuProps, [
    "onAction",
    "disabledKeys",
    "class"
  ])
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
      <Polymorphic
        as="div"
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
interface DropdownItemProps extends MenuItemRootProps {}

const DropdownItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownItemProps>
) => {
  return <MenuItemRoot {...(props as DropdownItemProps)} />
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
