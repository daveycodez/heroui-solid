// @vitest-environment jsdom
import { fireEvent, render, waitFor } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { classSet } from "../../test/utils"
import {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  TabsRoot
} from "./tabs"

const Basic = (props: {
  orientation?: "horizontal" | "vertical"
  variant?: "primary" | "secondary"
  defaultSelectedKey?: string
  onSelectionChange?: (key: string) => void
  disabledSecond?: boolean
}) => (
  <TabsRoot
    class="custom"
    defaultSelectedKey={props.defaultSelectedKey}
    onSelectionChange={props.onSelectionChange}
    orientation={props.orientation}
    variant={props.variant}
  >
    <TabListContainer>
      <TabList aria-label="Options">
        <Tab id="overview">
          Overview
          <TabIndicator />
        </Tab>
        <Tab id="analytics" isDisabled={props.disabledSecond}>
          <TabSeparator />
          Analytics
          <TabIndicator />
        </Tab>
      </TabList>
    </TabListContainer>
    <TabPanel id="overview">Overview panel</TabPanel>
    <TabPanel id="analytics">Analytics panel</TabPanel>
  </TabsRoot>
)

describe("Tabs", () => {
  it("renders the BEM structure with data-slots", () => {
    const { container } = render(() => <Basic />)
    const root = container.querySelector("[data-slot=tabs]") as HTMLElement
    expect(root).toBeTruthy()
    expect(classSet(root.className)).toContain("tabs")
    expect(root.classList.contains("custom")).toBe(true)
    expect(root.getAttribute("data-orientation")).toBe("horizontal")
    expect(
      container.querySelector("[data-slot=tabs-list-container]")
    ).toBeTruthy()
    expect(container.querySelector("[data-slot=scroll-shadow]")).toBeTruthy()
    expect(container.querySelector("[data-slot=tabs-list]")).toBeTruthy()
    expect(container.querySelectorAll("[data-slot=tabs-tab]")).toHaveLength(2)
    expect(container.querySelector("[data-slot=tabs-indicator]")).toBeTruthy()
    expect(container.querySelector("[data-slot=tabs-separator]")).toBeTruthy()
  })

  it("selects the first tab by default and shows its panel", async () => {
    const { container, findByText } = render(() => <Basic />)
    await findByText("Overview panel")
    const first = container.querySelector("[data-slot=tabs-tab]") as HTMLElement
    expect(first.getAttribute("data-selected")).toBe("true")
    // Panels are all in the SSR/DOM (forceMount); the inactive one is hidden.
    const panels = container.querySelectorAll(
      "[data-slot=tabs-panel]"
    ) as NodeListOf<HTMLElement>
    expect(panels).toHaveLength(2)
    expect(panels[0].hasAttribute("hidden")).toBe(false)
    expect(panels[1].hasAttribute("hidden")).toBe(true)
  })

  it("honors defaultSelectedKey", async () => {
    const { container, findByText } = render(() => (
      <Basic defaultSelectedKey="analytics" />
    ))
    await findByText("Analytics panel")
    const tabs = container.querySelectorAll(
      "[data-slot=tabs-tab]"
    ) as NodeListOf<HTMLElement>
    expect(tabs[1].getAttribute("data-selected")).toBe("true")
    expect(tabs[0].getAttribute("data-selected")).toBeNull()
  })

  it("switches tabs on click and re-stamps data-selected", async () => {
    const onSelectionChange = vi.fn()
    const { container, findByText } = render(() => (
      <Basic onSelectionChange={onSelectionChange} />
    ))
    await findByText("Overview panel")
    const tabs = container.querySelectorAll(
      "[data-slot=tabs-tab]"
    ) as NodeListOf<HTMLElement>
    const panels = container.querySelectorAll(
      "[data-slot=tabs-panel]"
    ) as NodeListOf<HTMLElement>
    fireEvent.click(tabs[1])
    expect(onSelectionChange).toHaveBeenCalledWith("analytics")
    await waitFor(() =>
      expect(tabs[1].getAttribute("data-selected")).toBe("true")
    )
    expect(tabs[0].getAttribute("data-selected")).toBeNull()
    expect(panels[0].hasAttribute("hidden")).toBe(true)
    expect(panels[1].hasAttribute("hidden")).toBe(false)
  })

  it("marks a disabled tab", () => {
    const { container } = render(() => <Basic disabledSecond />)
    const tabs = container.querySelectorAll(
      "[data-slot=tabs-tab]"
    ) as NodeListOf<HTMLElement>
    expect(tabs[1].getAttribute("data-disabled")).toBe("true")
    expect((tabs[1] as HTMLButtonElement).disabled).toBe(true)
  })

  it("applies the secondary variant class", () => {
    const { container } = render(() => <Basic variant="secondary" />)
    const root = container.querySelector("[data-slot=tabs]") as HTMLElement
    expect(root.classList.contains("tabs--secondary")).toBe(true)
  })

  it("supports vertical orientation", () => {
    const { container } = render(() => <Basic orientation="vertical" />)
    const root = container.querySelector("[data-slot=tabs]") as HTMLElement
    expect(root.getAttribute("data-orientation")).toBe("vertical")
  })
})
