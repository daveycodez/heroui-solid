import { Paperclip } from "gravity-icons-solid"
import { Button, Spinner } from "heroui-solid"
import { createSignal } from "solid-js"

export function LoadingState() {
  const [isPending, setIsPending] = createSignal(false)

  const handleClick = () => {
    setIsPending(true)
    setTimeout(() => setIsPending(false), 2000)
  }

  return (
    <Button isPending={isPending()} onClick={handleClick}>
      {isPending() ? <Spinner color="current" size="sm" /> : <Paperclip />}
      {isPending() ? "Uploading..." : "Upload File"}
    </Button>
  )
}
