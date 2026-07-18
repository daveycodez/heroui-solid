import type { ComponentProps } from "solid-js"

import {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  TabsRoot
} from "./tabs"

/* -------------------------------------------------------------------------------------------------
 * Compound Component
 * -----------------------------------------------------------------------------------------------*/
export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  ListContainer: TabListContainer,
  List: TabList,
  Tab: Tab,
  Indicator: TabIndicator,
  Panel: TabPanel,
  Separator: TabSeparator
})

export type Tabs = {
  Props: ComponentProps<typeof TabsRoot>
  RootProps: ComponentProps<typeof TabsRoot>
  ListContainerProps: ComponentProps<typeof TabListContainer>
  ListProps: ComponentProps<typeof TabList>
  TabProps: ComponentProps<typeof Tab>
  IndicatorProps: ComponentProps<typeof TabIndicator>
  PanelProps: ComponentProps<typeof TabPanel>
  SeparatorProps: ComponentProps<typeof TabSeparator>
}

export type { TabsVariants } from "@heroui/styles"
/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/
export { tabsVariants } from "@heroui/styles"
export type {
  TabIndicatorProps,
  TabListContainerProps,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabSeparatorProps,
  TabsRootProps,
  TabsRootProps as TabsProps
} from "./tabs"
/* -------------------------------------------------------------------------------------------------
 * Named Component
 * -----------------------------------------------------------------------------------------------*/
export {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  TabsRoot
} from "./tabs"
