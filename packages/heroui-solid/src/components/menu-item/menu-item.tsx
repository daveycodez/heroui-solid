import { cn, type MenuItemVariants, menuItemVariants } from "@heroui/styles"
import {
  Item as MenuItemPrimitive,
  SubTrigger as MenuSubTriggerPrimitive
} from "@kobalte/core/dropdown-menu"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  type ComponentProps,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { dataAttr } from "../../utils/assertion"

/* -------------------------------------------------------------------------------------------------
 * Selection (React Aria's Selection model, managed locally over Kobalte items)
 * -----------------------------------------------------------------------------------------------*/
type Selection = "all" | Set<string>
type SelectionMode = "none" | "single" | "multiple"

interface SelectionProps {
  selectionMode?: SelectionMode
  selectedKeys?: Selection
  defaultSelectedKeys?: Selection
  onSelectionChange?: (keys: Selection) => void
}

type SelectionContextValue = {
  selectionMode: SelectionMode
  isSelected: (key: string) => boolean
  select: (key: string) => void
}

const SelectionContext = createContext<SelectionContextValue>()

const createSelectionContextValue = (
  props: SelectionProps
): SelectionContextValue => {
  const [internal, setInternal] = createSignal<Selection>(
    props.defaultSelectedKeys ?? new Set()
  )
  const selection = () => props.selectedKeys ?? internal()

  return {
    get selectionMode() {
      return props.selectionMode ?? "none"
    },
    isSelected: (key) => {
      const current = selection()
      return current === "all" ? true : current.has(key)
    },
    select: (key) => {
      const current = selection()
      const currentSet = current === "all" ? new Set<string>() : current
      let next: Set<string>
      if ((props.selectionMode ?? "none") === "single") {
        next = currentSet.has(key) ? new Set() : new Set([key])
      } else {
        next = new Set(currentSet)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
      }
      setInternal(next)
      props.onSelectionChange?.(next)
    }
  }
}

/* -------------------------------------------------------------------------------------------------
 * Menu Context
 * -----------------------------------------------------------------------------------------------*/
type MenuContextValue = {
  onAction?: (key: string) => void
  disabledKeys?: Iterable<string>
}

const MenuContext = createContext<MenuContextValue>({})

// Marks the item slot of a submenu trigger: Dropdown.SubmenuTrigger provides
// `true` (its item renders Kobalte's SubTrigger), the popover resets to
// `false` for the submenu's own items.
const SubmenuTriggerContext = createContext<boolean>(false)

/* -------------------------------------------------------------------------------------------------
 * Menu Item Context
 * -----------------------------------------------------------------------------------------------*/
type MenuItemContextValue = {
  slots?: ReturnType<typeof menuItemVariants>
  isSelected?: () => boolean
  hasSubmenu?: boolean
}

const MenuItemContext = createContext<MenuItemContextValue>({})

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
  const selectionContext = useContext(SelectionContext)
  const isSubmenuTrigger = useContext(SubmenuTriggerContext)

  const slots = createMemo(() => menuItemVariants(variantProps))
  const disabledKeys = createMemo(() => new Set(menuContext.disabledKeys ?? []))
  const isDisabled = () => local.isDisabled || disabledKeys().has(local.id)

  if (isSubmenuTrigger) {
    return (
      <MenuItemContext.Provider
        value={{
          get slots() {
            return slots()
          },
          hasSubmenu: true
        }}
      >
        <MenuSubTriggerPrimitive
          class={cn(slots().item(), local.class)}
          data-slot="menu-item"
          data-has-submenu="true"
          disabled={isDisabled()}
          {...rest}
        />
      </MenuItemContext.Provider>
    )
  }

  const selectionMode = () => selectionContext?.selectionMode ?? "none"
  const isSelected = () =>
    selectionMode() !== "none" &&
    (selectionContext?.isSelected(local.id) ?? false)

  const onSelect = () => {
    if (selectionContext && selectionMode() !== "none") {
      selectionContext.select(local.id)
    }
    local.onAction?.()
    menuContext.onAction?.(local.id)
  }

  return (
    <MenuItemContext.Provider
      value={{
        get slots() {
          return slots()
        },
        isSelected
      }}
    >
      <MenuItemPrimitive
        class={cn(slots().item(), local.class)}
        data-slot="menu-item"
        role={
          selectionMode() === "single"
            ? "menuitemradio"
            : selectionMode() === "multiple"
              ? "menuitemcheckbox"
              : undefined
        }
        aria-checked={selectionMode() !== "none" ? isSelected() : undefined}
        data-selected={dataAttr(isSelected())}
        data-selection-mode={
          selectionMode() !== "none" ? selectionMode() : undefined
        }
        // React Aria keeps multiple-selection menus open on toggle.
        closeOnSelect={selectionMode() === "multiple" ? false : undefined}
        disabled={isDisabled()}
        onSelect={onSelect}
        {...rest}
      />
    </MenuItemContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Menu Item Indicator
 * -----------------------------------------------------------------------------------------------*/
interface MenuItemIndicatorState {
  isSelected: boolean
}

interface MenuItemIndicatorProps {
  type?: "checkmark" | "dot"
  class?: string
  /** Read `state` fields inside JSX — destructuring loses reactivity. */
  children?: JSX.Element | ((state: MenuItemIndicatorState) => JSX.Element)
}

const MenuItemIndicator = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, MenuItemIndicatorProps>
) => {
  const [local, rest] = splitProps(props as MenuItemIndicatorProps, [
    "type",
    "class",
    "children"
  ])
  const context = useContext(MenuItemContext)
  const isSelected = () => context.isSelected?.() ?? false
  const type = () => local.type ?? "checkmark"

  const state: MenuItemIndicatorState = {
    get isSelected() {
      return isSelected()
    }
  }

  return (
    <Polymorphic
      as="span"
      aria-hidden="true"
      class={cn(context.slots?.indicator(), local.class)}
      data-slot="menu-item-indicator"
      data-type={type()}
      data-visible={isSelected() || undefined}
      {...rest}
    >
      {(() => {
        // Single read (see AGENTS.md); function children re-run reactively.
        const body = local.children
        if (typeof body === "function") {
          return body(state)
        }
        if (body != null) {
          return body
        }
        return type() === "dot" ? (
          <svg
            aria-hidden="true"
            data-slot="menu-item-indicator--dot"
            fill="currentColor"
            role="presentation"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14"
              fill-rule="evenodd"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            data-slot="menu-item-indicator--checkmark"
            fill="none"
            role="presentation"
            stroke="currentColor"
            stroke-dasharray="22"
            stroke-dashoffset={isSelected() ? "44" : "66"}
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 17 18"
          >
            <polyline points="1 9 7 14 15 4" />
          </svg>
        )
      })()}
    </Polymorphic>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Menu Item Submenu Indicator
 * -----------------------------------------------------------------------------------------------*/
// aria-label dropped from upstream's icon: it named an element that
// aria-hidden removes from the accessibility tree (see AGENTS.md).
const IconChevronRight = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={16}
    role="presentation"
    viewBox="0 0 16 16"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clip-rule="evenodd"
      d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

interface MenuItemSubmenuIndicatorProps {
  class?: string
  children?: JSX.Element
}

const MenuItemSubmenuIndicator = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, MenuItemSubmenuIndicatorProps>
) => {
  const [local, rest] = splitProps(props as MenuItemSubmenuIndicatorProps, [
    "class",
    "children"
  ])
  const context = useContext(MenuItemContext)

  if (!context.hasSubmenu) {
    return null
  }

  return (
    <Polymorphic
      as="span"
      aria-hidden="true"
      class={cn(context.slots?.submenuIndicator(), local.class)}
      data-slot="submenu-indicator"
      {...rest}
    >
      {(() => {
        const body = local.children
        return body ?? <IconChevronRight />
      })()}
    </Polymorphic>
  )
}

export type {
  MenuContextValue,
  MenuItemContextValue,
  MenuItemIndicatorProps,
  MenuItemIndicatorState,
  MenuItemRootProps,
  MenuItemSubmenuIndicatorProps,
  Selection,
  SelectionContextValue,
  SelectionMode,
  SelectionProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  createSelectionContextValue,
  MenuContext,
  MenuItemContext,
  MenuItemIndicator,
  MenuItemRoot,
  MenuItemSubmenuIndicator,
  SelectionContext,
  SubmenuTriggerContext
}
