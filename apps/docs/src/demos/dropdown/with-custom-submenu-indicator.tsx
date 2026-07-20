import { ArrowRight } from "gravity-icons-solid"
import { Dropdown, Label } from "heroui-solid"

export function WithCustomSubmenuIndicator() {
  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="Menu" variant="secondary">
        Share
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item textValue="Copy Link">
              <Label>Copy Link</Label>
            </Dropdown.Item>
            <Dropdown.Item textValue="Facebook">
              <Label>Facebook</Label>
            </Dropdown.Item>
            <Dropdown.Sub>
              <Dropdown.SubTrigger textValue="More options">
                <Label>More options</Label>
                <ArrowRight class="ms-auto size-3.5 text-muted" />
              </Dropdown.SubTrigger>
              <Dropdown.Portal>
                <Dropdown.SubContent>
                  <Dropdown.Menu>
                    <Dropdown.Item textValue="WhatsApp">
                      <Label>WhatsApp</Label>
                    </Dropdown.Item>
                    <Dropdown.Item textValue="Telegram">
                      <Label>Telegram</Label>
                    </Dropdown.Item>
                    <Dropdown.Item textValue="Discord">
                      <Label>Discord</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.SubContent>
              </Dropdown.Portal>
            </Dropdown.Sub>
            <Dropdown.Sub>
              <Dropdown.SubTrigger textValue="Other">
                <Label>Other (arrow indicator)</Label>
                <ArrowRight class="ms-auto size-3.5 text-muted" />
              </Dropdown.SubTrigger>
              <Dropdown.Portal>
                <Dropdown.SubContent>
                  <Dropdown.Menu>
                    <Dropdown.Item textValue="SMS">
                      <Label>SMS</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.SubContent>
              </Dropdown.Portal>
            </Dropdown.Sub>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Portal>
    </Dropdown>
  )
}
