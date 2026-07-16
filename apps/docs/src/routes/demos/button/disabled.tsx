import { Button } from "heroui-solid"
import DemoBox from "../../../components/DemoBox"

export default function ButtonDisabledDemo() {
  return (
    <DemoBox>
      <Button isDisabled>Primary</Button>
      <Button variant="outline" isDisabled>
        Outline
      </Button>
    </DemoBox>
  )
}
