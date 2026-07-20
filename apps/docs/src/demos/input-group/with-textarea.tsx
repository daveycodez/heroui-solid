import {
  ArrowUp,
  At,
  Microphone,
  PlugConnection,
  Plus
} from "gravity-icons-solid"
import {
  Button,
  InputGroup,
  Kbd,
  Spinner,
  TextArea,
  TextField,
  Tooltip
} from "heroui-solid"
import { createSignal } from "solid-js"

export function WithTextArea() {
  const [value, setValue] = createSignal("")
  const [isSubmitting, setIsSubmitting] = createSignal(false)

  const handleSubmit = () => {
    if (!value().trim()) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setValue("")
    }, 1000)
  }

  return (
    <TextField
      fullWidth
      aria-label="Prompt input"
      class="flex w-sm flex-col sm:w-lg"
      name="prompt"
      value={value()}
      onChange={setValue}
    >
      <InputGroup fullWidth class="flex flex-col gap-2 rounded-3xl py-2">
        <InputGroup.Prefix class="px-3 py-0">
          <Button aria-label="Add context" size="sm" variant="outline">
            <At />
            Add Context
          </Button>
        </InputGroup.Prefix>
        <TextArea
          class="w-full resize-none px-3.5 py-0"
          placeholder="Assign tasks or ask anything..."
          rows={5}
        />
        <InputGroup.Suffix class="flex w-full items-center gap-1.5 px-3 py-0">
          <Tooltip openDelay={0}>
            <Tooltip.Trigger
              as={Button}
              isIconOnly
              aria-label="Attach file"
              size="sm"
              variant="tertiary"
            >
              <Plus />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>
                <p class="text-xs">Add a files and more</p>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip>
          <Tooltip openDelay={0}>
            <Tooltip.Trigger
              as={Button}
              isIconOnly
              aria-label="Connect Apps"
              size="sm"
              variant="tertiary"
            >
              <PlugConnection />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>
                <p class="text-xs">Connect apps</p>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip>
          <div class="ml-auto flex items-center gap-1.5">
            <Tooltip openDelay={0}>
              <Tooltip.Trigger
                as={Button}
                isIconOnly
                aria-label="Voice input"
                size="sm"
                variant="ghost"
              >
                <Microphone />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  <p class="text-xs">Voice input</p>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
            <Tooltip openDelay={0}>
              <Tooltip.Trigger
                as={Button}
                isIconOnly
                aria-label="Send prompt"
                disabled={!value().trim()}
                isPending={isSubmitting()}
                onClick={handleSubmit}
              >
                {isSubmitting() ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  <ArrowUp />
                )}
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content class="flex items-center gap-1">
                  <p class="text-xs">Send</p>
                  <Kbd class="h-4 rounded-sm px-1">
                    <Kbd.Abbr keyValue="enter" />
                  </Kbd>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
          </div>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  )
}
