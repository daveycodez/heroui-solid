import { Button } from "heroui-solid"
import DemoBox from "../../../components/DemoBox"

export default function ButtonVariantsDemo() {
  return (
    <DemoBox>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-soft">Danger Soft</Button>
    </DemoBox>
  )
}
