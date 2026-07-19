import { Accordion } from "heroui-solid"

export function Multiple() {
  return (
    <Accordion multiple class="w-full max-w-md">
      <Accordion.Item value="getting-started">
        <Accordion.Header>
          <Accordion.Trigger>
            Getting Started
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              Learn the basics of HeroUI and how to integrate it into your React
              project. This section covers installation, setup, and your first
              component.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="core-concepts">
        <Accordion.Header>
          <Accordion.Trigger>
            Core Concepts
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              Understand the fundamental concepts behind HeroUI, including the
              compound component pattern, styling with Tailwind CSS, and
              accessibility features.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="advanced-usage">
        <Accordion.Header>
          <Accordion.Trigger>
            Advanced Usage
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              Explore advanced features like custom variants, theme
              customization, and integration with other libraries in your React
              ecosystem.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="best-practices">
        <Accordion.Header>
          <Accordion.Trigger>
            Best Practices
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div class="accordion__body">
            <div class="accordion__body-inner">
              Follow our recommended best practices for building performant,
              accessible, and maintainable applications with HeroUI components.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
