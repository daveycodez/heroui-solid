import { Tabs } from "heroui-solid"

export function Disabled() {
  return (
    <Tabs class="w-full max-w-md">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Tabs with disabled">
          <Tabs.Tab id="active">
            Active
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab isDisabled id="disabled">
            Disabled
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="available">
            Available
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel class="pt-4" id="active">
        <p>This tab is active and can be selected.</p>
      </Tabs.Panel>
      <Tabs.Panel class="pt-4" id="disabled">
        <p>This content cannot be accessed.</p>
      </Tabs.Panel>
      <Tabs.Panel class="pt-4" id="available">
        <p>This tab is also available for selection.</p>
      </Tabs.Panel>
    </Tabs>
  )
}
