// @vitest-environment jsdom
import { buttonVariants } from "@heroui/styles"
import { render } from "@solidjs/testing-library"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"
import {
  type ButtonSize,
  type ButtonVariant,
  type ButtonVariantProps,
  buttonStyles
} from "./button.styles"

const classSet = (classes: string) =>
  new Set(classes.split(/\s+/).filter(Boolean))

describe("buttonStyles parity with @heroui/styles buttonVariants", () => {
  const variants: (ButtonVariant | undefined)[] = [
    undefined,
    "primary",
    "secondary",
    "tertiary",
    "outline",
    "ghost",
    "danger",
    "danger-soft"
  ]
  const sizes: (ButtonSize | undefined)[] = [undefined, "sm", "md", "lg"]
  const bools = [undefined, false, true]

  it("emits identical class sets across the full variant matrix", () => {
    for (const variant of variants) {
      for (const size of sizes) {
        for (const fullWidth of bools) {
          for (const isIconOnly of bools) {
            const props: ButtonVariantProps = {
              variant,
              size,
              fullWidth,
              isIconOnly
            }
            expect(
              classSet(buttonStyles(props)),
              JSON.stringify(props)
            ).toEqual(classSet(buttonVariants(props)))
          }
        }
      }
    }
  })
})

describe("Button", () => {
  it("renders a native button with BEM classes, data-slot and caller class last", () => {
    const { getByRole } = render(() => (
      <Button variant="ghost" size="lg" class="custom">
        Hi
      </Button>
    ))
    const button = getByRole("button")
    expect(button.tagName).toBe("BUTTON")
    expect(button.getAttribute("type")).toBe("button")
    expect(button.getAttribute("data-slot")).toBe("button")
    expect(button.className).toBe("button button--ghost button--lg custom")
  })

  it("maps isDisabled to the native disabled attribute", () => {
    const { getByRole } = render(() => <Button isDisabled>Hi</Button>)
    expect((getByRole("button") as HTMLButtonElement).disabled).toBe(true)
  })

  it("stamps pending state and swallows clicks while pending", () => {
    const onClick = vi.fn()
    const { getByRole } = render(() => (
      <Button isPending onClick={onClick}>
        Hi
      </Button>
    ))
    const button = getByRole("button")
    expect(button.getAttribute("data-pending")).toBe("true")
    expect(button.getAttribute("aria-disabled")).toBe("true")
    button.click()
    expect(onClick).not.toHaveBeenCalled()
  })

  it("invokes onClick when not pending", () => {
    const onClick = vi.fn()
    const { getByRole } = render(() => <Button onClick={onClick}>Hi</Button>)
    getByRole("button").click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("supports render-prop children receiving { isPending }", () => {
    const { getByRole } = render(() => (
      <Button isPending>
        {(state) => <span>{state.isPending ? "Loading" : "Idle"}</span>}
      </Button>
    ))
    expect(getByRole("button").textContent).toBe("Loading")
  })

  it("is polymorphic via as", () => {
    const { getByRole } = render(() => (
      <Button as="a" href="https://example.com">
        Link
      </Button>
    ))
    const link = getByRole("link")
    expect(link.tagName).toBe("A")
    expect(link.getAttribute("href")).toBe("https://example.com")
    expect(link.className).toContain("button button--primary button--md")
  })
})
