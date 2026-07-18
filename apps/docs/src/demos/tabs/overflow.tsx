import { Tabs } from "heroui-solid"
import { For } from "solid-js"

const items = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "reports", label: "Reports" },
  { id: "performance", label: "Performance" },
  { id: "engagement", label: "Engagement" },
  { id: "audience", label: "Audience" },
  { id: "acquisition", label: "Acquisition" },
  { id: "retention", label: "Retention" },
  { id: "settings", label: "Settings" }
]

export function Overflow() {
  return (
    <div class="w-[400px]">
      <Tabs>
        <Tabs.ListContainer initialShadow>
          <Tabs.List aria-label="Overflow options">
            <For each={items}>
              {(item) => (
                <Tabs.Tab id={item.id}>
                  {item.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              )}
            </For>
          </Tabs.List>
        </Tabs.ListContainer>
        <For each={items}>
          {(item) => (
            <Tabs.Panel class="pt-4" id={item.id}>
              <p>{item.label} panel content.</p>
            </Tabs.Panel>
          )}
        </For>
      </Tabs>
    </div>
  )
}
