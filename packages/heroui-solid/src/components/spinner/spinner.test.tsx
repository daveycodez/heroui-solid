// @vitest-environment jsdom
import { spinnerVariants } from "@heroui/styles"
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { Spinner } from "./spinner"
import {
  type SpinnerColor,
  type SpinnerSize,
  type SpinnerVariantProps,
  spinnerStyles
} from "./spinner.styles"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("spinnerStyles parity with @heroui/styles spinnerVariants", () => {
  const colors: (SpinnerColor | undefined)[] = [
    undefined,
    "accent",
    "current",
    "danger",
    "success",
    "warning"
  ]
  const sizes: (SpinnerSize | undefined)[] = [undefined, "sm", "md", "lg", "xl"]

  it("emits identical class sets across the full variant matrix", () => {
    for (const color of colors) {
      for (const size of sizes) {
        const props: SpinnerVariantProps = { color, size }
        expect(classSet(spinnerStyles(props)), JSON.stringify(props)).toEqual(
          classSet(spinnerVariants(props))
        )
      }
    }
  })
})

describe("Spinner", () => {
  it("renders HeroUI's anatomy: span[data-slot=spinner] > svg[data-slot=spinner-icon]", () => {
    const { container } = render(() => (
      <Spinner color="current" size="sm" class="extra" />
    ))
    const root = container.querySelector('[data-slot="spinner"]')
    expect(root?.tagName).toBe("SPAN")
    expect(root?.className).toBe("spinner spinner--current spinner--sm extra")
    expect(root?.querySelector('svg[data-slot="spinner-icon"]')).toBeTruthy()
  })
})
