import { Button, Spinner } from "heroui-solid"
import DemoBox from "../../../components/DemoBox"

export default function ButtonPendingDemo() {
  return (
    <DemoBox>
      <Button isPending>
        {(state) => (
          <>
            {state.isPending && <Spinner color="current" size="sm" />}
            Saving…
          </>
        )}
      </Button>
    </DemoBox>
  )
}
