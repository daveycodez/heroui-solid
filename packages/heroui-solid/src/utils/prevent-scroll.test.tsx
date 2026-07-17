// @vitest-environment jsdom
import { createRoot } from "solid-js"
import { afterEach, describe, expect, it } from "vitest"
import { PreventScroll } from "./prevent-scroll"

const root = () => document.documentElement

const touchEvent = (type: string, touchCount = 1) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, "touches", {
    value: Array.from({ length: touchCount }, () => ({}))
  })
  return event
}

describe("PreventScroll", () => {
  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "platform")
  })

  it("locks scrolling on the root element and restores on cleanup", () => {
    let dispose!: () => void
    createRoot((d) => {
      dispose = d
      PreventScroll()
    })
    expect(root().style.overflow).toBe("hidden")
    dispose()
    expect(root().style.overflow).toBe("")
  })

  it("holds the lock until the last overlay releases", () => {
    let first!: () => void
    let second!: () => void
    createRoot((d) => {
      first = d
      PreventScroll()
    })
    createRoot((d) => {
      second = d
      PreventScroll()
    })
    first()
    expect(root().style.overflow).toBe("hidden")
    second()
    expect(root().style.overflow).toBe("")
  })

  describe("on iOS", () => {
    const mockIOS = () => {
      Object.defineProperty(window.navigator, "platform", {
        value: "iPhone",
        configurable: true
      })
    }

    it("blocks window touch scrolling and restores everything", () => {
      mockIOS()
      const nativeFocus = HTMLElement.prototype.focus
      let dispose!: () => void
      createRoot((d) => {
        dispose = d
        PreventScroll()
      })

      expect(root().style.overflow).toBe("hidden")
      const injected = Array.from(document.head.querySelectorAll("style")).find(
        (s) => s.textContent?.includes("overscroll-behavior: contain")
      )
      expect(injected).toBeTruthy()
      expect(HTMLElement.prototype.focus).not.toBe(nativeFocus)

      // A touch move outside any scrollable element scrolls the window —
      // prevented.
      const move = touchEvent("touchmove")
      document.body.dispatchEvent(move)
      expect(move.defaultPrevented).toBe(true)

      // Two-finger moves are pinch-zoom — allowed.
      const pinch = touchEvent("touchmove", 2)
      document.body.dispatchEvent(pinch)
      expect(pinch.defaultPrevented).toBe(false)

      dispose()
      expect(root().style.overflow).toBe("")
      expect(HTMLElement.prototype.focus).toBe(nativeFocus)
      expect(document.head.contains(injected as Node)).toBe(false)
    })

    it("allows touch scrolling inside an overflowing scrollable element", () => {
      mockIOS()
      const scrollable = document.createElement("div")
      scrollable.style.overflow = "auto"
      Object.defineProperty(scrollable, "scrollHeight", {
        value: 100,
        configurable: true
      })
      document.body.appendChild(scrollable)

      let dispose!: () => void
      createRoot((d) => {
        dispose = d
        PreventScroll()
      })

      scrollable.dispatchEvent(touchEvent("touchstart"))
      const move = touchEvent("touchmove")
      scrollable.dispatchEvent(move)
      expect(move.defaultPrevented).toBe(false)

      dispose()
      scrollable.remove()
    })
  })
})
