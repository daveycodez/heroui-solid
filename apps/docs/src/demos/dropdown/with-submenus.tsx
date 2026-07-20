import { Dropdown, Label } from "heroui-solid"

const ChevronRight = () => (
  <svg
    aria-hidden="true"
    class="ms-auto size-3.5 text-muted"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

export function WithSubmenus() {
  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Share
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item textValue="Copy Link">
            <Label>Copy Link</Label>
          </Dropdown.Item>
          <Dropdown.Item textValue="Facebook">
            <Label>Facebook</Label>
          </Dropdown.Item>
          <Dropdown.Item textValue="Twitter">
            <Label>X / Twitter</Label>
          </Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger textValue="Other">
              <Label>Other</Label>
              <ChevronRight />
            </Dropdown.SubTrigger>
            <Dropdown.Portal>
              <Dropdown.SubContent>
                <Dropdown.Item textValue="WhatsApp">
                  <Label>WhatsApp</Label>
                </Dropdown.Item>
                <Dropdown.Item textValue="Telegram">
                  <Label>Telegram</Label>
                </Dropdown.Item>
                <Dropdown.Item textValue="Discord">
                  <Label>Discord</Label>
                </Dropdown.Item>
                <Dropdown.Sub>
                  <Dropdown.SubTrigger textValue="Email">
                    <Label>Email</Label>
                    <ChevronRight />
                  </Dropdown.SubTrigger>
                  <Dropdown.Portal>
                    <Dropdown.SubContent>
                      <Dropdown.Item textValue="Work email">
                        <Label>Work email</Label>
                      </Dropdown.Item>
                      <Dropdown.Item textValue="Personal email">
                        <Label>Personal email</Label>
                      </Dropdown.Item>
                    </Dropdown.SubContent>
                  </Dropdown.Portal>
                </Dropdown.Sub>
              </Dropdown.SubContent>
            </Dropdown.Portal>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  )
}
