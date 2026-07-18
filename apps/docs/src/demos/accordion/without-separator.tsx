import {
  ChevronDown,
  CreditCard,
  Receipt,
  ShoppingBag
} from "gravity-icons-solid"
import { Accordion } from "heroui-solid"
import { For, type JSX } from "solid-js"

const items: Array<{ content: string; icon: JSX.Element; title: string }> = [
  {
    content:
      "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
    icon: <ShoppingBag />,
    title: "How do I place an order?"
  },
  {
    content:
      "Yes, you can modify or cancel your order before it's shipped. Once your order is processed, you can't make changes.",
    icon: <Receipt />,
    title: "Can I modify or cancel my order?"
  },
  {
    content:
      "We accept all major credit cards, including Visa, Mastercard, and American Express.",
    icon: <CreditCard />,
    title: "What payment methods do you accept?"
  }
]

export function WithoutSeparator() {
  return (
    <Accordion hideSeparator class="w-full max-w-md">
      <For each={items}>
        {(item) => (
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                {item.icon ? (
                  <span class="mr-3 size-4 shrink-0 text-muted">
                    {item.icon}
                  </span>
                ) : null}
                {item.title}
                <Accordion.Indicator>
                  <ChevronDown />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>{item.content}</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        )}
      </For>
    </Accordion>
  )
}
