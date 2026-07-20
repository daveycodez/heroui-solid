import {
  cn,
  dropdownVariants,
  type MenuItemVariants,
  menuItemVariants,
  menuSectionVariants
} from "@heroui/styles"
import { DropdownMenu } from "@kobalte/core/dropdown-menu"
import {
  type ComponentProps,
  createContext,
  createMemo,
  mergeProps,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { Button } from "../button"
import { Header } from "../header"

/* -------------------------------------------------------------------------------------------------
 * Dropdown Context
 * -----------------------------------------------------------------------------------------------*/
type DropdownContextValue = {
  slots?: ReturnType<typeof dropdownVariants>
}

const DropdownContext = createContext<DropdownContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Dropdown Root
 * -----------------------------------------------------------------------------------------------*/
type DropdownRootProps = ComponentProps<typeof DropdownMenu>

const DropdownRoot = (props: DropdownRootProps) => {
  const merged = mergeProps({ gutter: 8 }, props)
  const slots = createMemo(() => dropdownVariants())

  return (
    <DropdownContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <DropdownMenu {...merged} />
    </DropdownContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Trigger
 * -----------------------------------------------------------------------------------------------*/
type DropdownTriggerProps<T extends ValidComponent = typeof Button> =
  ComponentProps<typeof DropdownMenu.Trigger<T>>

const DropdownTrigger = <T extends ValidComponent = typeof Button>(
  props: DropdownTriggerProps<T>
) => {
  const context = useContext(DropdownContext)
  // Default the trigger to our HeroUI Button (so Button props like `variant`
  // work out of the box); an explicit `as` still wins.
  const merged = mergeProps({ as: Button }, props as DropdownTriggerProps)
  const [local, rest] = splitProps(merged, ["class"])
  return (
    <DropdownMenu.Trigger
      class={cn(context.slots?.trigger(), local.class)}
      data-slot="dropdown-trigger"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Portal
 * -----------------------------------------------------------------------------------------------*/
const DropdownPortal = DropdownMenu.Portal

/* -------------------------------------------------------------------------------------------------
 * Dropdown Content
 * -----------------------------------------------------------------------------------------------*/
type DropdownContentProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenu.Content<T>
>

const DropdownContent = <T extends ValidComponent = "div">(
  props: DropdownContentProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownContentProps, ["class"])
  const context = useContext(DropdownContext)
  return (
    <DropdownMenu.Content
      class={cn(context.slots?.popover(), context.slots?.menu(), local.class)}
      data-slot="dropdown-popover"
      {...rest}
      tabIndex={-1}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Arrow
 * -----------------------------------------------------------------------------------------------*/
const DropdownArrow = DropdownMenu.Arrow

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item
 * -----------------------------------------------------------------------------------------------*/
type DropdownItemProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenu.Item<T>
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
    <DropdownMenu.Item
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Item Indicator
 * -----------------------------------------------------------------------------------------------*/
type DropdownItemIndicatorProps<T extends ValidComponent = "div"> =
  ComponentProps<typeof DropdownMenu.ItemIndicator<T>>

const DropdownItemIndicator = <T extends ValidComponent = "div">(
  props: DropdownItemIndicatorProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownItemIndicatorProps, [
    "class"
  ])
  return (
    <DropdownMenu.ItemIndicator
      class={cn(menuItemVariants().indicator(), local.class)}
      data-slot="menu-item-indicator"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Group
 * -----------------------------------------------------------------------------------------------*/
type DropdownGroupProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenu.Group<T>
>

const DropdownGroup = <T extends ValidComponent = "div">(
  props: DropdownGroupProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownGroupProps, ["class"])
  return (
    <DropdownMenu.Group
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
  ComponentProps<typeof DropdownMenu.GroupLabel<T>>

const DropdownGroupLabel = <T extends ValidComponent = typeof Header>(
  props: DropdownGroupLabelProps<T>
) => {
  const [local, rest] = splitProps(
    props as DropdownGroupLabelProps & { as?: ValidComponent },
    ["class", "as"]
  )
  return (
    <DropdownMenu.GroupLabel
      as={(local.as ?? Header) as ValidComponent}
      class={local.class}
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Icon
 * -----------------------------------------------------------------------------------------------*/
const DropdownIcon = DropdownMenu.Icon

/* -------------------------------------------------------------------------------------------------
 * Dropdown Checkbox Item
 * -----------------------------------------------------------------------------------------------*/
type DropdownCheckboxItemProps<T extends ValidComponent = "div"> =
  ComponentProps<typeof DropdownMenu.CheckboxItem<T>> & MenuItemVariants

const DropdownCheckboxItem = <T extends ValidComponent = "div">(
  props: DropdownCheckboxItemProps<T>
) => {
  const [variantProps, local, rest] = splitProps(
    props as DropdownCheckboxItemProps,
    menuItemVariants.variantKeys,
    ["class"]
  )
  return (
    <DropdownMenu.CheckboxItem
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Radio Group
 * -----------------------------------------------------------------------------------------------*/
const DropdownRadioGroup = DropdownMenu.RadioGroup

/* -------------------------------------------------------------------------------------------------
 * Dropdown Radio Item
 * -----------------------------------------------------------------------------------------------*/
type DropdownRadioItemProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenu.RadioItem<T>
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
    <DropdownMenu.RadioItem
      class={cn(menuItemVariants(variantProps).item(), local.class)}
      data-slot="menu-item"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Sub
 * -----------------------------------------------------------------------------------------------*/
type DropdownSubProps = ComponentProps<typeof DropdownMenu.Sub>

const DropdownSub = (props: DropdownSubProps) => {
  // Sub is a separate Kobalte primitive, so it doesn't inherit the root's
  // gutter default — apply the same 8px default here.
  const merged = mergeProps({ gutter: 8 }, props)
  return <DropdownMenu.Sub {...merged} />
}

/* -------------------------------------------------------------------------------------------------
 * Dropdown Sub Trigger
 * -----------------------------------------------------------------------------------------------*/
type DropdownSubTriggerProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenu.SubTrigger<T>
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
    <DropdownMenu.SubTrigger
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
  typeof DropdownMenu.SubContent<T>
>

const DropdownSubContent = <T extends ValidComponent = "div">(
  props: DropdownSubContentProps<T>
) => {
  const [local, rest] = splitProps(props as DropdownSubContentProps, ["class"])
  const context = useContext(DropdownContext)
  return (
    <DropdownMenu.SubContent
      class={cn(context.slots?.popover(), context.slots?.menu(), local.class)}
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
  DropdownContentProps,
  DropdownGroupLabelProps,
  DropdownGroupProps,
  DropdownItemIndicatorProps,
  DropdownItemProps,
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
  DropdownContent,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownIcon,
  DropdownItem,
  DropdownItemIndicator,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownRoot,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger
}
