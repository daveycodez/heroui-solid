import { Tabs } from "heroui-solid"

export function CustomElement() {
  return (
    <Tabs class="w-full max-w-md">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          <Tabs.Tab as="a" href="#getting-started" id="getting-started">
            Getting Started
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab as="a" href="#components" id="components">
            Components
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab as="a" href="#releases" id="releases">
            Releases
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel class="pt-4" id="getting-started">
        <p>Each tab renders as an anchor via Kobalte's polymorphic as prop.</p>
      </Tabs.Panel>
      <Tabs.Panel class="pt-4" id="components">
        <p>Track your metrics and analyze performance data.</p>
      </Tabs.Panel>
      <Tabs.Panel class="pt-4" id="releases">
        <p>Generate and download detailed reports.</p>
      </Tabs.Panel>
    </Tabs>
  )
}
