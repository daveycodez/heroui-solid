import {
  cn,
  dropdownVariants,
  type MenuItemVariants,
  menuItemVariants,
  menuSectionVariants
} from "@heroui/styles"
import { DropdownMenu as DropdownMenuPrimitive } from "@kobalte/core/dropdown-menu"
import {
  type ComponentProps,
  createContext,
  createMemo,
  mergeProps,
  Show,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { PreventScroll } from "../../utils/prevent-scroll"
import { Button } from "../button"
import { Header } from "../header"
import {
  MenuItemIndicator,
  type MenuItemIndicatorProps
} from "./menu-item-indicator"

/* -------------------------------------------------------------------------------------------------
 * Dropdown Context
 * -----------------------------------------------------------------------------------------------*/
type DropdownContextValue = {
  slots?: ReturnType<typeof dropdownVariants>
  preventScroll?: boolean
}

const DropdownContext = createContext<DropdownContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Dropdown Root
 * -----------------------------------------------------------------------------------------------*/
type DropdownRootProps = ComponentProps<typeof DropdownMenuPrimitive>

const DropdownRoot = (props: DropdownRootProps) => {
  // Kobalte's own scroll lock sets overflow:hidden on <body>, which makes body
  // the scroll container and collapses every position:sticky element in the page
  // (header/sidebar vanish). Always disable it and let Popover mount
  // <PreventScroll /> (locks <html>, preserves sticky — see AGENTS.md). The
  // consumer's `preventScroll` (default true) drives whether we lock at all, so
  // `preventScroll={false}` truly disables the lock rather than swapping which
  // element Kobalte freezes.
  const [local, rest] = splitProps(props, ["preventScroll"])
  const merged = mergeProps({ gutter: 8, preventScroll: false }, rest)
  const slots = createMemo(() => dropdownVariants())
  const preventScroll = () => local.preventScroll ?? true

  return (
    <DropdownContext.Provider
      value={{
        get slots() {
          return slots()
        },
        get preventScroll() {
          return preventScroll()
        }
      }}
    >
      <DropdownMenuPrimitive {...merged} />
    </DropdownContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Trigger
 * -----------------------------------------------------------------------------------------------*/
type DropdownTriggerProps<T extends ValidComponent = typeof Button> =
  ComponentProps<typeof DropdownMenuPrimitive.Trigger<T>>

const DropdownTrigger = <T extends ValidComponent = typeof Button>(
  props: DropdownTriggerProps<T>
) => {
  const context = useContext(DropdownContext)
  // Default the trigger to our HeroUI Button (so Button props like `variant`
  // work out of the box); an explicit `as` still wins.
  const merged = mergeProps({ as: Button }, props as DropdownTriggerProps)
  const [local, rest] = splitProps(merged, ["class"])
  return (
    <DropdownMenuPrimitive.Trigger
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="dropdown-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Portal
 * -----------------------------------------------------------------------------------------------*/
const DropdownPortal = DropdownMenuPrimitive.Portal

/* -------------------------------------------------------------------------------------------------
 * Dropdown Popover
 * -----------------------------------------------------------------------------------------------*/
// The scroll container. Kobalte's Content is the role="menu" positioned element;
// we style it as the popover (max-height/overflow live here — see overrides) and
// let the inner Dropdown.Menu hold the padded item list, mirroring upstream's
// separate Popover > Menu so item focus rings aren't clipped by the scroll edge.
type DropdownPopoverProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.Content<T>
>

const DropdownPopover = <T extends ValidComponent = "div">(
  props: DropdownPopoverProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownPopoverProps, [
    "class",
    "children"
  ])
  const context = useContext(DropdownContext)
  return (
    <DropdownMenuPrimitive.Content
      class={cn(context.slots?.popover(), local.class)}
      data-slot="dropdown-popover"
      {...rest}
    >
      {/* Locks <html> for the popover's lifetime (SSR-inert, renders null).
          Skipped when the root got preventScroll={false}. */}
      <Show when={context.preventScroll}>
        <PreventScroll />
      </Show>
      {local.children}
    </DropdownMenuPrimitive.Content>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Menu
 * -----------------------------------------------------------------------------------------------*/
// The padded item list inside a Popover/SubContent. Not a Kobalte primitive —
// role="menu" already lives on the Kobalte Content above, so this stays
// presentational (role="presentation") to keep the menu -> menuitem ownership.
interface DropdownMenuProps extends ComponentProps<"div"> {}

const DropdownMenu = (props: DropdownMenuProps) => {
  const [local, rest] = splitProps(props, ["class"])
  const context = useContext(DropdownContext)
  return (
    <div
      class={cn(context.slots?.menu(), local.class)}
      data-slot="dropdown-menu"
      role="presentation"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Arrow
 * -----------------------------------------------------------------------------------------------*/
const DropdownArrow = DropdownMenuPrimitive.Arrow

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item
 * -----------------------------------------------------------------------------------------------*/
type DropdownItemProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.Item<T>
> &
  MenuItemVariants

const DropdownItem = <T extends ValidComponent = "div">(
  props: DropdownItemProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as DropdownItemProps,
    menuItemVariants.variantKeys,
    ["class"]
  )
  return (
    <DropdownMenuPrimitive.Item
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item Indicator
 * -----------------------------------------------------------------------------------------------*/
// The selection indicator (built-in animated checkmark/dot, always mounted for
// alignment — see menu-item-indicator.tsx).
const DropdownItemIndicator = MenuItemIndicator
type DropdownItemIndicatorProps<T extends ValidComponent = "div"> =
  MenuItemIndicatorProps<T>

/* -------------------------------------------------------------------------------------------------
 * Dropdown Group
 * -----------------------------------------------------------------------------------------------*/
type DropdownGroupProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.Group<T>
>

const DropdownGroup = <T extends ValidComponent = "div">(
  props: DropdownGroupProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownGroupProps, ["class"])
  return (
    <DropdownMenuPrimitive.Group
      class={cn(menuSectionVariants(), local.class)}
      data-slot="menu-section"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Group Label
 * -----------------------------------------------------------------------------------------------*/
// Kobalte's GroupLabel is the context-aware section label: it registers its id
// with the enclosing Group so Kobalte stamps `aria-labelledby` on the group
// (the same wiring React Aria gives HeroUI's <Header>). Default to rendering as
// our Header so it keeps the header styling; an explicit `as` still wins.
type DropdownGroupLabelProps<T extends ValidComponent = typeof Header> =
  ComponentProps<typeof DropdownMenuPrimitive.GroupLabel<T>>

const DropdownGroupLabel = <T extends ValidComponent = typeof Header>(
  props: DropdownGroupLabelProps<T>
) => {
  const [local, rest] = splitProps(
    props as DropdownGroupLabelProps & { as?: ValidComponent },
    ["class", "as"]
  )
  return (
    <DropdownMenuPrimitive.GroupLabel
      as={(local.as ?? Header) as ValidComponent}
      class={local.class}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Icon
 * -----------------------------------------------------------------------------------------------*/
const DropdownIcon = DropdownMenuPrimitive.Icon

/* -------------------------------------------------------------------------------------------------
 * Dropdown Checkbox Item
 * -----------------------------------------------------------------------------------------------*/
type DropdownCheckboxItemProps<T extends ValidComponent = "div"> =
  ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem<T>> &
    MenuItemVariants

const DropdownCheckboxItem = <T extends ValidComponent = "div">(
  props: DropdownCheckboxItemProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as DropdownCheckboxItemProps,
    menuItemVariants.variantKeys,
    ["class"]
  )
  return (
    <DropdownMenuPrimitive.CheckboxItem
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Radio Group
 * -----------------------------------------------------------------------------------------------*/
const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup

/* -------------------------------------------------------------------------------------------------
 * Dropdown Radio Item
 * -----------------------------------------------------------------------------------------------*/
type DropdownRadioItemProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem<T>
> &
  MenuItemVariants

const DropdownRadioItem = <T extends ValidComponent = "div">(
  props: DropdownRadioItemProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as DropdownRadioItemProps,
    menuItemVariants.variantKeys,
    ["class"]
  )
  return (
    <DropdownMenuPrimitive.RadioItem
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Sub
 * -----------------------------------------------------------------------------------------------*/
type DropdownSubProps = ComponentProps<typeof DropdownMenuPrimitive.Sub>

const DropdownSub = (props: DropdownSubProps) => {
  // Sub is a separate Kobalte primitive, so it doesn't inherit the root's
  // gutter default — apply the same 8px default here.
  const merged = mergeProps({ gutter: 8 }, props)
  return <DropdownMenuPrimitive.Sub {...merged} />
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Sub Trigger
 * -----------------------------------------------------------------------------------------------*/
type DropdownSubTriggerProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger<T>
> &
  MenuItemVariants

const DropdownSubTrigger = <T extends ValidComponent = "div">(
  props: DropdownSubTriggerProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as DropdownSubTriggerProps,
    menuItemVariants.variantKeys,
    ["class"]
  )
  return (
    <DropdownMenuPrimitive.SubTrigger
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      data-has-submenu="true"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Sub Content
 * -----------------------------------------------------------------------------------------------*/
type DropdownSubContentProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.SubContent<T>
>

const DropdownSubContent = <T extends ValidComponent = "div">(
  props: DropdownSubContentProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownSubContentProps, ["class"])
  const context = useContext(DropdownContext)
  return (
    <DropdownMenuPrimitive.SubContent
      class={cn(context.slots?.popover(), local.class)}
      data-slot="dropdown-popover"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type {
  DropdownCheckboxItemProps,
  DropdownGroupLabelProps,
  DropdownGroupProps,
  DropdownItemIndicatorProps,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopoverProps,
  DropdownRadioItemProps,
  DropdownRootProps,
  DropdownSubContentProps,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownTriggerProps
}

export {
  DropdownArrow,
  DropdownCheckboxItem,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownIcon,
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownRoot,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger
}
