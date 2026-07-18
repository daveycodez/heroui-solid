import { Accordion } from "heroui-solid"

export function CustomElement() {
  return (
    <Accordion as="section" class="w-full max-w-md">
      <Accordion.Item as="article">
        <Accordion.Heading as="h4">
          <Accordion.Trigger>
            Custom Elements
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            This accordion renders a section root, an article item, and an h4
            heading via Kobalte's polymorphic as prop.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
