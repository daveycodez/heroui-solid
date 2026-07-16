import { Button } from "heroui-solid"
import Plus from "~icons/gravity-ui/plus"

export function FullWidth() {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "0.75rem",
        width: "400px",
        "max-width": "100%"
      }}
    >
      <Button fullWidth>Primary Button</Button>
      <Button fullWidth>
        <Plus />
        With Icon
      </Button>
    </div>
  )
}
