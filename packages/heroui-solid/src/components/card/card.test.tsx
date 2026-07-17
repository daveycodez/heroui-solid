// @vitest-environment jsdom

import { render } from "@solidjs/testing-library"
import { describe, expect, it } from "vitest"
import { classSet } from "../../test/utils"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle
} from "./card"

const Anatomy = (props: {
  variant?: "default" | "secondary" | "tertiary" | "transparent"
}) => (
  <CardRoot class="custom" variant={props.variant}>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>Content</CardContent>
    <CardFooter>Footer</CardFooter>
  </CardRoot>
)

describe("Card", () => {
  it("renders the full anatomy with slot classes and data-slots", () => {
    const { container } = render(() => <Anatomy />)
    const card = container.querySelector("[data-slot=card]") as HTMLElement
    expect(card.tagName).toBe("DIV")
    expect(classSet(card.className)).toEqual(
      new Set(["card", "card--default", "custom"])
    )

    const parts: Array<[string, string, string]> = [
      ["card-header", "card__header", "DIV"],
      ["card-title", "card__title", "H3"],
      ["card-description", "card__description", "P"],
      ["card-content", "card__content", "DIV"],
      ["card-footer", "card__footer", "DIV"]
    ]
    for (const [slot, className, tagName] of parts) {
      const el = container.querySelector(`[data-slot=${slot}]`) as HTMLElement
      expect(el.tagName).toBe(tagName)
      expect(classSet(el.className)).toEqual(new Set([className]))
    }
  })

  it("applies variant modifiers on the root only", () => {
    const { container } = render(() => <Anatomy variant="secondary" />)
    const card = container.querySelector("[data-slot=card]") as HTMLElement
    expect(card.classList.contains("card--secondary")).toBe(true)
    const header = container.querySelector(
      "[data-slot=card-header]"
    ) as HTMLElement
    expect(classSet(header.className)).toEqual(new Set(["card__header"]))
  })

  it("merges caller classes after slot classes", () => {
    const { container } = render(() => (
      <CardRoot>
        <CardContent class="custom-content">Content</CardContent>
      </CardRoot>
    ))
    const content = container.querySelector(
      "[data-slot=card-content]"
    ) as HTMLElement
    expect(classSet(content.className)).toEqual(
      new Set(["card__content", "custom-content"])
    )
  })

  it("is polymorphic via as", () => {
    const { container } = render(() => (
      <CardRoot as="article">
        <CardTitle as="h2">Title</CardTitle>
      </CardRoot>
    ))
    expect(
      (container.querySelector("[data-slot=card]") as HTMLElement).tagName
    ).toBe("ARTICLE")
    expect(
      (container.querySelector("[data-slot=card-title]") as HTMLElement).tagName
    ).toBe("H2")
  })
})
