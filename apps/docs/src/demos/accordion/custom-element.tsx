import { Accordion } from "heroui-solid"

export function CustomElement() {
  return (
    <Accordion collapsible as="section" class="w-full max-w-md">
      <Accordion.Item as="article" value="custom-elements">
        <Accordion.Header as="h4">
          <Accordion.Trigger>
            Custom Elements
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              This accordion renders a section root, an article item, and an h4
              heading via Kobalte's polymorphic as prop.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
