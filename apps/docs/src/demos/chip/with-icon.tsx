import {
  ChevronDown,
  CircleCheckFill,
  CircleFill,
  Clock,
  Xmark
} from "gravity-icons-solid"
import { Chip } from "heroui-solid"

export function ChipWithIcon() {
  return (
    <div class="flex flex-wrap items-center gap-3">
      <Chip>
        <CircleFill width={6} />
        <Chip.Label>Information</Chip.Label>
      </Chip>
      <Chip color="success">
        <CircleCheckFill width={12} />
        <Chip.Label>Completed</Chip.Label>
      </Chip>
      <Chip color="warning">
        <Clock width={12} />
        <Chip.Label>Pending</Chip.Label>
      </Chip>
      <Chip color="danger">
        <Xmark width={12} />
        <Chip.Label>Failed</Chip.Label>
      </Chip>
      <Chip color="accent">
        <Chip.Label>Label</Chip.Label>
        <ChevronDown width={12} />
      </Chip>
    </div>
  )
}
