// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("Avatar", () => {
  it("renders the root with slot classes and the fallback (image not loaded)", () => {
    const { container } = render(() => (
      <AvatarRoot>
        <AvatarImage alt="Bob" src="https://example.com/bob.jpg" />
        <AvatarFallback>B</AvatarFallback>
      </AvatarRoot>
    ))

    const root = container.querySelector(".avatar") as HTMLElement
    expect(root).not.toBeNull()
    expect(classSet(root.className)).toEqual(new Set(["avatar", "avatar--md"]))

    // jsdom never loads images: the img stays unmounted, the fallback shows.
    expect(container.querySelector("img")).toBeNull()
    const fallback = container.querySelector(
      "[data-slot=avatar-fallback]"
    ) as HTMLElement
    expect(fallback.textContent).toBe("B")
    expect(classSet(fallback.className)).toEqual(
      new Set(["avatar__fallback", "avatar__fallback--default"])
    )
  })

  it("applies size, variant, and fallback color overrides", () => {
    const { container } = render(() => (
      <AvatarRoot size="lg" variant="soft">
        <AvatarFallback color="success">S</AvatarFallback>
      </AvatarRoot>
    ))

    const root = container.querySelector(".avatar") as HTMLElement
    expect(classSet(root.className)).toEqual(
      new Set(["avatar", "avatar--lg", "avatar--soft"])
    )
    const fallback = container.querySelector(
      "[data-slot=avatar-fallback]"
    ) as HTMLElement
    expect(fallback.className).toContain("avatar__fallback--success")
  })

  it("root color drives the fallback slot color", () => {
    const { container } = render(() => (
      <AvatarRoot color="danger">
        <AvatarFallback>D</AvatarFallback>
      </AvatarRoot>
    ))
    const fallback = container.querySelector(
      "[data-slot=avatar-fallback]"
    ) as HTMLElement
    expect(fallback.className).toContain("avatar__fallback--danger")
  })

  it("delays the fallback when delayMs is set", async () => {
    const { container } = render(() => (
      <AvatarRoot>
        <AvatarFallback delayMs={30}>B</AvatarFallback>
      </AvatarRoot>
    ))
    expect(container.querySelector("[data-slot=avatar-fallback]")).toBeNull()
    await new Promise((resolve) => setTimeout(resolve, 60))
    expect(
      container.querySelector("[data-slot=avatar-fallback]")
    ).not.toBeNull()
  })
})
