import { Button } from "heroui-solid"
import DemoBox from "../../../components/DemoBox"

export default function ButtonLinkDemo() {
  return (
    <DemoBox>
      <Button
        as="a"
        href="https://heroui.com"
        target="_blank"
        variant="outline"
      >
        Visit HeroUI
      </Button>
    </DemoBox>
  )
}
