// @vitest-environment jsdom
import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import { KbdAbbr, KbdContent, KbdRoot } from "./kbd"

// Kbd is presentational. These guard only the thin skin we own: slot classes,
// the KbdKey symbol/title maps, the variant modifier, class merging, and the
// polymorphic `as`.

describe("Kbd (thin skin)", () => {
  it("renders the anatomy with BEM classes and key symbol/label", () => {
    const { container } = render(() => (
      <KbdRoot>
        <KbdAbbr keyValue="command" />
        <KbdContent>K</KbdContent>
      </KbdRoot>
    ))

    const root = container.querySelector("kbd") as HTMLElement
    expect(classSet(root.className)).toEqual(new Set(["kbd"]))

    const abbr = container.querySelector("abbr") as HTMLElement
    expect(abbr.getAttribute("title")).toBe("Command")
    expect(abbr.textContent).toBe("⌘")
    expect(classSet(abbr.className)).toEqual(new Set(["kbd__abbr"]))

    const content = container.querySelector("span") as HTMLElement
    expect(content.textContent).toBe("K")
    expect(classSet(content.className)).toEqual(new Set(["kbd__content"]))
  })

  it("applies the light variant", () => {
    const { container } = render(() => (
      <KbdRoot variant="light">
        <KbdContent>L</KbdContent>
      </KbdRoot>
    ))
    const root = container.querySelector("kbd") as HTMLElement
    expect(classSet(root.className)).toEqual(new Set(["kbd", "kbd--light"]))
  })

  it("maps every key to a symbol and label", () => {
    const { container } = render(() => (
      <KbdRoot>
        <KbdAbbr keyValue="shift" />
        <KbdAbbr keyValue="escape" />
      </KbdRoot>
    ))
    const abbrs = container.querySelectorAll("abbr")
    expect(abbrs[0]?.textContent).toBe("⇧")
    expect(abbrs[0]?.getAttribute("title")).toBe("Shift")
    expect(abbrs[1]?.textContent).toBe("⎋")
    expect(abbrs[1]?.getAttribute("title")).toBe("Escape")
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => (
      <KbdRoot as="div">
        <KbdContent as="p">K</KbdContent>
      </KbdRoot>
    ))
    expect(container.querySelector(".kbd")?.tagName).toBe("DIV")
    expect(container.querySelector(".kbd__content")?.tagName).toBe("P")
  })
})
