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
          Learn the basics of HeroUI and how to integrate it into your React
          project. This section covers installation, setup, and your first
          component.
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
          Understand the fundamental concepts behind HeroUI, including the
          compound component pattern, styling with Tailwind CSS, and
          accessibility features.
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
          Explore advanced features like custom variants, theme customization,
          and integration with other libraries in your React ecosystem.
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
          Follow our recommended best practices for building performant,
          accessible, and maintainable applications with HeroUI components.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
