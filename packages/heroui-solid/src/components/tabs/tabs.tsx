import { cn, type TabsVariants, tabsVariants } from "@heroui/styles"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  Content as TabsContentPrimitive,
  List as TabsListPrimitive,
  Root as TabsRootPrimitive,
  Trigger as TabsTriggerPrimitive
} from "@kobalte/core/tabs"
import { mergeRefs } from "@kobalte/utils"
import {
  type ComponentProps,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  onMount,
  Show,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { setupInteractionModality } from "../../utils/interaction-modality"
import { ScrollShadow } from "../scroll-shadow"

/* -------------------------------------------------------------------------------------------------
 * Tabs Context
 * -----------------------------------------------------------------------------------------------*/
type Ref = HTMLElement | ((el: HTMLElement) => void)

type TabsContextValue = {
  slots?: ReturnType<typeof tabsVariants>
  orientation: () => "horizontal" | "vertical"
  // Selected key resolved during render (defaults to the first enabled tab), so
  // the selected panel/indicator render correctly under SSR — Kobalte only
  // resolves its own selection in a post-mount effect.
  resolvedSelected: () => string | undefined
  registerEnabledTab: (id: string) => void
}

const TabsContext = createContext<TabsContextValue>()

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs.Root>")
  }
  return context
}

type TabItemContextValue = { isSelected: () => boolean }
const TabItemContext = createContext<TabItemContextValue>()

/* -------------------------------------------------------------------------------------------------
 * Icons
 * -----------------------------------------------------------------------------------------------*/
const chevron =
  (d: string) =>
  (props: ComponentProps<"svg">): JSX.Element => (
    <svg
      aria-hidden="true"
      fill="none"
      role="presentation"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d={d} />
    </svg>
  )

const IconChevronDown = chevron("m6 9 6 6 6-6")
const IconChevronUp = chevron("m18 15-6-6-6 6")
const IconChevronLeft = chevron("m15 18-6-6 6-6")
const IconChevronRight = chevron("m9 18 6-6-6-6")

/* -------------------------------------------------------------------------------------------------
 * Tabs Root
 * -----------------------------------------------------------------------------------------------*/
interface TabsRootProps extends TabsVariants {
  children?: JSX.Element
  class?: string
  orientation?: "horizontal" | "vertical"
  selectedKey?: string
  defaultSelectedKey?: string
  onSelectionChange?: (key: string) => void
  ref?: Ref
}

const TabsRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as TabsRootProps,
    tabsVariants.variantKeys,
    [
      "class",
      "children",
      "orientation",
      "selectedKey",
      "defaultSelectedKey",
      "onSelectionChange",
      "ref"
    ]
  )
  const slots = createMemo(() => tabsVariants(variantProps))

  const orientation = () => local.orientation ?? "horizontal"

  const [selectedValue, setSelectedValue] = createSignal<string | undefined>(
    local.selectedKey ?? local.defaultSelectedKey
  )

  // First enabled tab (registered during render) — the SSR/no-JS default that
  // matches Kobalte's own "select the first enabled tab" behaviour.
  let firstEnabledTabId: string | undefined
  const registerEnabledTab = (id: string) => {
    if (firstEnabledTabId === undefined) firstEnabledTabId = id
  }
  const resolvedSelected = () =>
    local.selectedKey ?? selectedValue() ?? firstEnabledTabId

  onMount(setupInteractionModality)

  return (
    <TabsContext.Provider
      value={{
        get slots() {
          return slots()
        },
        orientation,
        resolvedSelected,
        registerEnabledTab
      }}
    >
      <TabsRootPrimitive
        class={cn(slots().base(), local.class)}
        data-slot="tabs"
        defaultValue={local.defaultSelectedKey}
        onChange={(value) => {
          setSelectedValue(value)
          local.onSelectionChange?.(value)
        }}
        orientation={orientation()}
        ref={mergeRefs(local.ref)}
        value={local.selectedKey}
        {...rest}
      >
        {local.children}
      </TabsRootPrimitive>
    </TabsContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tabs List Container
 * -----------------------------------------------------------------------------------------------*/
interface TabListContainerProps {
  children?: JSX.Element
  class?: string
}

const TabListContainer = (props: TabListContainerProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useTabs()

  let scroller: HTMLElement | undefined
  const isVertical = () => context.orientation() === "vertical"

  const scrollBy = (direction: 1 | -1) => {
    const el = scroller
    if (!el) return
    const size = isVertical() ? el.clientHeight : el.clientWidth
    el.scrollBy({
      behavior: "smooth",
      [isVertical() ? "top" : "left"]: direction * size * 0.8
    })
  }

  return (
    <div
      class={cn(context.slots?.tabListContainer(), local.class)}
      data-slot="tabs-list-container"
      {...rest}
    >
      <ScrollShadow
        class={context.slots?.scroller()}
        hideScrollBar
        // Tab lists usually fit; assuming overflow in SSR would flash a scroll
        // chevron that vanishes once the client measures no overflow.
        initialShadow={false}
        orientation={context.orientation()}
        ref={(el: HTMLDivElement) => {
          scroller = el
        }}
        size={64}
      >
        {local.children}
      </ScrollShadow>
      <button
        aria-label={isVertical() ? "Scroll tabs up" : "Scroll tabs left"}
        class={context.slots?.scrollPrev()}
        onClick={() => scrollBy(-1)}
        tabIndex={-1}
        type="button"
      >
        {isVertical() ? <IconChevronUp /> : <IconChevronLeft />}
      </button>
      <button
        aria-label={isVertical() ? "Scroll tabs down" : "Scroll tabs right"}
        class={context.slots?.scrollNext()}
        onClick={() => scrollBy(1)}
        tabIndex={-1}
        type="button"
      >
        {isVertical() ? <IconChevronDown /> : <IconChevronRight />}
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tabs List
 * -----------------------------------------------------------------------------------------------*/
interface TabListProps {
  children?: JSX.Element
  class?: string
  "aria-label"?: string
}

const TabList = (props: TabListProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const context = useTabs()

  return (
    <TabsListPrimitive
      class={cn(context.slots?.tabList(), local.class)}
      data-slot="tabs-list"
      {...rest}
    >
      {local.children}
    </TabsListPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tab
 * -----------------------------------------------------------------------------------------------*/
interface TabProps {
  children?: JSX.Element
  class?: string
  id: string
  isDisabled?: boolean
  ref?: Ref
}

const Tab = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, TabProps>
) => {
  const [local, rest] = splitProps(props as TabProps, [
    "class",
    "id",
    "isDisabled",
    "ref"
  ])
  const context = useTabs()

  if (!local.isDisabled) context.registerEnabledTab(local.id)

  const isSelected = () => context.resolvedSelected() === local.id

  return (
    <TabItemContext.Provider value={{ isSelected }}>
      <TabsTriggerPrimitive
        class={cn(context.slots?.tab(), local.class)}
        // Kobalte stamps data-selected/data-disabled as empty strings; HeroUI
        // CSS (and the custom-styles demo's data-[selected=true]) match "true".
        data-disabled={local.isDisabled ? "true" : undefined}
        data-selected={isSelected() ? "true" : undefined}
        data-slot="tabs-tab"
        disabled={local.isDisabled}
        ref={local.ref}
        value={local.id}
        {...rest}
      />
    </TabItemContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tab Indicator — upstream renders one SelectionIndicator inside each tab and
 * mounts it only for the selected tab. Kobalte has no per-item indicator, so
 * this renders the same shape: a CSS-positioned pill inside the selected tab
 * (fills it via `.tabs__indicator`, no layout measurement — SSR-correct, no
 * animate-in). Placed inside a `<Tabs.Tab>`.
 * -----------------------------------------------------------------------------------------------*/
interface TabIndicatorProps {
  class?: string
}

const TabIndicator = (props: TabIndicatorProps): JSX.Element => {
  const context = useTabs()
  const item = useContext(TabItemContext)

  return (
    <Show when={item?.isSelected()}>
      <div
        class={cn(context.slots?.tabIndicator(), props.class)}
        data-slot="tabs-indicator"
        role="presentation"
      />
    </Show>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tab Panel
 * -----------------------------------------------------------------------------------------------*/
interface TabPanelProps {
  children?: JSX.Element
  class?: string
  id: string
}

const TabPanel = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabPanelProps>
) => {
  const [local, rest] = splitProps(props as TabPanelProps, [
    "class",
    "id",
    "children"
  ])
  const context = useTabs()

  const isSelected = () => context.resolvedSelected() === local.id

  return (
    // forceMount keeps every panel in the SSR payload (Kobalte otherwise
    // unmounts unselected panels, and selects nothing during SSR); we drive
    // visibility off the render-resolved selection instead.
    <TabsContentPrimitive
      class={cn(context.slots?.tabPanel(), local.class)}
      data-slot="tabs-panel"
      forceMount
      hidden={isSelected() ? undefined : true}
      value={local.id}
      {...rest}
    >
      {local.children}
    </TabsContentPrimitive>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Tab Separator
 * -----------------------------------------------------------------------------------------------*/
interface TabSeparatorProps {
  class?: string
}

const TabSeparator = (props: TabSeparatorProps): JSX.Element => {
  const [local, rest] = splitProps(props, ["class"])
  const context = useTabs()

  return (
    <span
      aria-hidden="true"
      class={cn(context.slots?.separator(), local.class)}
      data-slot="tabs-separator"
      {...rest}
    />
  )
}

export type {
  TabIndicatorProps,
  TabListContainerProps,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabSeparatorProps,
  TabsRootProps
}
/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  TabsRoot
}
