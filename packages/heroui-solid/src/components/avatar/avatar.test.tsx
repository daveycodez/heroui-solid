// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar"

// Avatar is a thin skin over Kobalte's Image — image load/fallback timing and
// the fallbackDelay behavior are Kobalte's and aren't retested. These cover only
// our slot wiring: the base/fallback slot classes, the size/variant modifiers,
// and the color that cascades from the root to the fallback slot via context.

const fallback = (c: HTMLElement) =>
  c.querySelector("[data-slot=avatar-fallback]") as HTMLElement

describe("Avatar (thin skin)", () => {
  it("stamps the base slot class and the fallback slot", () => {
    const { container } = render(() => (
      <AvatarRoot>
        <AvatarImage alt="Bob" src="https://example.com/bob.jpg" />
        <AvatarFallback>B</AvatarFallback>
      </AvatarRoot>
    ))
    const root = container.querySelector(".avatar") as HTMLElement
    expect(classSet(root.className)).toEqual(new Set(["avatar", "avatar--md"]))

    expect(fallback(container).textContent).toBe("B")
    expect(classSet(fallback(container).className)).toEqual(
      new Set(["avatar__fallback", "avatar__fallback--default"])
    )
  })

  it("maps size and variant to the base slot modifiers", () => {
    const { container } = render(() => (
      <AvatarRoot size="lg" variant="soft">
        <AvatarFallback color="success">S</AvatarFallback>
      </AvatarRoot>
    ))
    const root = container.querySelector(".avatar") as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set(["avatar", "avatar--lg", "avatar--soft"])
    )
    expect(fallback(container).className).toContain("avatar__fallback--success")
  })

  it("cascades the root color to the fallback slot via context", () => {
    const { container } = render(() => (
      <AvatarRoot color="danger">
        <AvatarFallback>D</AvatarFallback>
      </AvatarRoot>
    ))
    expect(fallback(container).className).toContain("avatar__fallback--danger")
  })
})
