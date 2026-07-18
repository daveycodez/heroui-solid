import { Tabs } from "heroui-solid"

export function CustomStyles() {
  return (
    <Tabs class="w-full max-w-lg text-center">
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Options"
          class="w-fit *:h-6 *:w-fit *:px-3 *:text-sm *:font-normal *:data-[selected=true]:text-accent-foreground"
        >
          <Tabs.Tab id="daily">
            Daily
            <Tabs.Indicator class="bg-accent" />
          </Tabs.Tab>
          <Tabs.Tab id="weekly">
            Weekly
            <Tabs.Indicator class="bg-accent" />
          </Tabs.Tab>
          <Tabs.Tab id="bi-weekly">
            Bi-Weekly
            <Tabs.Indicator class="bg-accent" />
          </Tabs.Tab>
          <Tabs.Tab id="monthly">
            Monthly
            <Tabs.Indicator class="bg-accent" />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  )
}
