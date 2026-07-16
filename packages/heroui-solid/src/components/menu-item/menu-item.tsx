import { cn, type MenuItemVariants, menuItemVariants } from "@heroui/styles"
import { Item as MenuItemPrimitive } from "@kobalte/core/dropdown-menu"
import {
  createContext,
  createMemo,
  type JSX,
  splitProps,
  useContext
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Menu Context
 * -----------------------------------------------------------------------------------------------*/
type MenuContextValue = {
  onAction?: (key: string) => void
  disabledKeys?: Iterable<string>
}

const MenuContext = createContext<MenuContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Menu Item Root
 * -----------------------------------------------------------------------------------------------*/
interface MenuItemRootProps {
  id: string
  textValue?: string
  isDisabled?: boolean
  onAction?: () => void
  /** Visual variant. @default "default" */
  variant?: MenuItemVariants["variant"]
  class?: string
  children?: JSX.Element
}

const MenuItemRoot = (props: MenuItemRootProps) => {
  const [local, rest] = splitProps(props, [
    "id",
    "isDisabled",
    "onAction",
    "variant",
    "class"
  ])
  const menuContext = useContext(MenuContext)

  const slots = createMemo(() =>
    menuItemVariants({ variant: local.variant ?? "default" })
  )
  const disabledKeys = createMemo(() => new Set(menuContext.disabledKeys ?? []))

  const onSelect = () => {
    local.onAction?.()
    menuContext.onAction?.(local.id)
  }

  return (
    <MenuItemPrimitive
      class={cn(slots().item(), local.class)}
      data-slot="menu-item"
      disabled={local.isDisabled || disabledKeys().has(local.id)}
      onSelect={onSelect}
      {...rest}
    />
  )
}

export type { MenuContextValue, MenuItemRootProps }
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export { MenuContext, MenuItemRoot }
