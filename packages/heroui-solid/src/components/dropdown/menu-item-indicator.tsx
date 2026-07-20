import { cn, menuItemVariants } from "@heroui/styles"
import { DropdownMenu as DropdownMenuPrimitive } from "@kobalte/core/dropdown-menu"
import {
  type ComponentProps,
  children as resolveChildren,
  Show,
  splitProps,
  type ValidComponent
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Built-in indicators
 * -----------------------------------------------------------------------------------------------*/
// HeroUI's exact indicator svgs (menu-item.tsx, v3). Decorative — the menu item
// itself carries the a11y selection state (aria-checked), so these are hidden
// from the a11y tree. The checkmark draws in via stroke-dashoffset and the dot
// scales/fades; both animations are driven from the item's checked state in
// menu-item.overrides.css (upstream sets the offset inline per render).
const IndicatorCheckmark = () => (
  <svg
    aria-hidden="true"
    data-slot="menu-item-indicator--checkmark"
    fill="none"
    stroke="currentColor"
    stroke-dasharray="22"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 17 18"
  >
    <polyline points="1 9 7 14 15 4" />
  </svg>
)

const IndicatorDot = () => (
  <svg
    aria-hidden="true"
    data-slot="menu-item-indicator--dot"
    fill="currentColor"
    fill-rule="evenodd"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14"
      fill-rule="evenodd"
    />
  </svg>
)

/* -------------------------------------------------------------------------------------------------
 * Menu Item Indicator
 * -----------------------------------------------------------------------------------------------*/
type MenuItemIndicatorProps<T extends ValidComponent = "div"> = ComponentProps<
  typeof DropdownMenuPrimitive.ItemIndicator<T>
> & {
  type?: "checkmark" | "dot"
}

const MenuItemIndicator = <T extends ValidComponent = "div">(
  props: MenuItemIndicatorProps<T>
) => {
  const [local, rest] = splitProps(props as MenuItemIndicatorProps, [
    "class",
    "children",
    "type"
  ])
  const resolved = resolveChildren(() => local.children)
  return (
    <DropdownMenuPrimitive.ItemIndicator
      class={cn(menuItemVariants().indicator(), local.class)}
      data-slot="menu-item-indicator"
      data-type={local.type ?? "checkmark"}
      {...rest}
      // forceMount so the indicator is always in the DOM: heroui reserves the
      // inline-start gutter with `.menu-item:has(.menu-item__indicator)` (ps-7),
      // aligning checked and unchecked items alike, and the always-present
      // checkmark can animate its draw on toggle. Kobalte still stamps
      // data-checked when the item is selected, which the visuals key off. Wins
      // over any caller value — the alignment/animation depend on it.
      forceMount
    >
      <Show
        when={resolved()}
        fallback={
          local.type === "dot" ? <IndicatorDot /> : <IndicatorCheckmark />
        }
      >
        {resolved()}
      </Show>
    </DropdownMenuPrimitive.ItemIndicator>
  )
}

export type { MenuItemIndicatorProps }
export { MenuItemIndicator }
