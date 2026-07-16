import { Button } from "heroui-solid"
import Envelope from "~icons/gravity-ui/envelope"
import Globe from "~icons/gravity-ui/globe"
import Plus from "~icons/gravity-ui/plus"
import TrashBin from "~icons/gravity-ui/trash-bin"

export function WithIcons() {
  return (
    <>
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
    </>
  )
}
