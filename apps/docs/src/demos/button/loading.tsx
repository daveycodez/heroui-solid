import { Button, Spinner } from "heroui-solid"

export function Loading() {
  return (
    <Button isPending>
      <Spinner color="current" size="sm" />
      Uploading...
    </Button>
  )
}
