// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { useFilter } from "./use-filter"

describe("useFilter", () => {
  it("matches case- and accent-insensitively with sensitivity: base", () => {
    const { contains, startsWith, endsWith } = useFilter({
      sensitivity: "base"
    })

    expect(contains("California", "cal")).toBe(true)
    expect(contains("California", "for")).toBe(true)
    expect(contains("California", "xyz")).toBe(false)

    expect(startsWith("California", "cal")).toBe(true)
    expect(startsWith("California", "for")).toBe(false)

    expect(endsWith("California", "nia")).toBe(true)
    expect(endsWith("California", "cal")).toBe(false)

    // Accent-insensitive under sensitivity: "base".
    expect(contains("résumé", "resume")).toBe(true)
    expect(startsWith("Éclair", "ecl")).toBe(true)
  })

  it("treats an empty substring as a match", () => {
    const { contains, startsWith, endsWith } = useFilter()
    expect(contains("anything", "")).toBe(true)
    expect(startsWith("anything", "")).toBe(true)
    expect(endsWith("anything", "")).toBe(true)
  })

  it("respects case with sensitivity: case", () => {
    const { contains } = useFilter({ sensitivity: "case" })
    expect(contains("California", "cal")).toBe(false)
    expect(contains("California", "Cal")).toBe(true)
  })
})
