import { Button, Card, ScrollShadow } from "heroui-solid"
import { For } from "solid-js"

export function WithCard() {
  return (
    <Card class="max-w-[400px]">
      <Card.Header>
        <Card.Title>Terms and Conditions</Card.Title>
        <Card.Description>Please review before proceeding</Card.Description>
      </Card.Header>
      <Card.Content class="p-0">
        <ScrollShadow initialShadow class="h-[300px] px-4" size={80}>
          <div class="space-y-4">
            <For each={Array.from({ length: 10 })}>
              {() => (
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  Morbi accumsan cursus enim, sed ultricies sapien.
                </p>
              )}
            </For>
          </div>
        </ScrollShadow>
      </Card.Content>
      <Card.Footer class="mt-4 flex flex-row gap-2">
        <Button class="w-full" variant="secondary">
          Cancel
        </Button>
        <Button class="w-full">Accept</Button>
      </Card.Footer>
    </Card>
  )
}
