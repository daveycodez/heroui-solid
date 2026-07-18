import { Envelope, Globe, Plus, TrashBin } from "gravity-icons-solid"
import { Button } from "heroui-solid"

export function WithIcons() {
  return (
    <div class="flex flex-wrap gap-3">
      <Button>
        <Globe />
        Search
      </Button>
      <Button variant="secondary">
        <Plus />
        Add Member
      </Button>
      <Button variant="tertiary">
        <Envelope />
        Email
      </Button>
      <Button variant="danger">
        <TrashBin />
        Delete
      </Button>
    </div>
  )
}
