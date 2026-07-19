import { describe, expect, it } from "vitest"
import { parseCSSTime } from "./css"

describe("parseCSSTime", () => {
  it("parses milliseconds", () => {
    expect(parseCSSTime("1500ms")).toBe(1500)
  })

  it("parses seconds into milliseconds", () => {
    expect(parseCSSTime("0.5s")).toBe(500)
    expect(parseCSSTime("2s")).toBe(2000)
  })

  it("trims surrounding whitespace", () => {
    expect(parseCSSTime("  300ms  ")).toBe(300)
  })

  it("treats a unitless number as milliseconds", () => {
    expect(parseCSSTime("250")).toBe(250)
  })

  it("returns undefined for empty or invalid values", () => {
    expect(parseCSSTime("")).toBeUndefined()
    expect(parseCSSTime(undefined)).toBeUndefined()
    expect(parseCSSTime("auto")).toBeUndefined()
  })
})
