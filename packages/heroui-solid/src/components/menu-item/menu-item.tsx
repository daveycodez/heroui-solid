import { cn, type MenuItemVariants, menuItemVariants } from "@heroui/styles"
import { Item as MenuItemPrimitive } from "@kobalte/core/dropdown-menu"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  createMemo,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
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
interface MenuItemRootProps extends MenuItemVariants {
  id: string
  textValue?: string
  isDisabled?: boolean
  onAction?: () => void
  class?: string
  children?: JSX.Element
}

const MenuItemRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, MenuItemRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as MenuItemRootProps,
    menuItemVariants.variantKeys,
    ["id", "isDisabled", "onAction", "class"]
  )
  const menuContext = useContext(MenuContext)

  const slots = createMemo(() => menuItemVariants(variantProps))
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
