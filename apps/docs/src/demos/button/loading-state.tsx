import { Paperclip } from "gravity-icons-solid"
import { Button, Spinner } from "heroui-solid"
import { createSignal } from "solid-js"

export function LoadingState() {
  const [isLoading, setLoading] = createSignal(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <Button isPending={isLoading()} onClick={handleClick}>
      {(state) => (
        <>
          {state.isPending ? (
            <Spinner color="current" size="sm" />
          ) : (
            <Paperclip />
          )}
          {state.isPending ? "Uploading..." : "Upload File"}
        </>
      )}
    </Button>
  )
}
