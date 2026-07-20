import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CodeFork,
  Ellipsis,
  Picture,
  Pin,
  QrCode,
  Star,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  ThumbsDown,
  ThumbsUp,
  Video
} from "gravity-icons-solid"
import {
  Button,
  ButtonGroup,
  Chip,
  Description,
  Dropdown,
  Label
} from "heroui-solid"

export function Basic() {
  return (
    <div class="flex flex-col items-start gap-6">
      {/* Single button with dropdown */}
      <div class="flex flex-col gap-2">
        <ButtonGroup>
          <Button>Merge pull request</Button>
          <Dropdown placement="bottom-end">
            <Dropdown.Trigger isIconOnly aria-label="More options">
              <ButtonGroup.Separator />
              <ChevronDown />
            </Dropdown.Trigger>
            <Dropdown.Portal>
              <Dropdown.Popover class="max-w-[290px]">
                <Dropdown.Menu>
                  <Dropdown.Item
                    class="flex flex-col items-start gap-1"
                    textValue="Create a merge commit"
                  >
                    <Label>Create a merge commit</Label>
                    <Description>
                      All commits from this branch will be added to the base
                      branch
                    </Description>
                  </Dropdown.Item>
                  <Dropdown.Item
                    class="flex flex-col items-start gap-1"
                    textValue="Squash and merge"
                  >
                    <Label>Squash and merge</Label>
                    <Description>
                      The 14 commits from this branch will be combined into one
                      commit in the base branch
                    </Description>
                  </Dropdown.Item>
                  <Dropdown.Item
                    class="flex flex-col items-start gap-1"
                    textValue="Rebase and merge"
                  >
                    <Label>Rebase and merge</Label>
                    <Description>
                      The 14 commits from this branch will be rebased and added
                      to the base branch
                    </Description>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Portal>
          </Dropdown>
        </ButtonGroup>
      </div>

      {/* Individual buttons */}
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap gap-x-2 gap-y-4">
          <ButtonGroup variant="tertiary">
            <Button>
              <CodeFork class="size-3.5" />
              Fork
              <Chip color="accent" size="sm" variant="soft">
                24
              </Chip>
            </Button>
            <Button isIconOnly>
              <ButtonGroup.Separator />
              <ChevronDown />
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="tertiary">
            <Button isIconOnly>
              <QrCode />
            </Button>
            <Button>
              <ButtonGroup.Separator />
              Scan to pay
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="tertiary">
            <Button>
              <ThumbsUp />
              <span class="text-xs font-semibold">2.4K</span>
            </Button>
            <Button isIconOnly>
              <ButtonGroup.Separator />
              <ThumbsDown />
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="tertiary">
            <Button>
              <Star class="size-3.5" />
              Star
            </Button>
            <Button class="px-2">
              <ButtonGroup.Separator />
              <Chip color="accent" size="sm" variant="soft">
                104
              </Chip>
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="tertiary">
            <Button>
              <Pin />
              Pinned
            </Button>
            <Button isIconOnly>
              <ButtonGroup.Separator />
              <ChevronDown />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Previous/Next Button Group */}
      <div class="flex flex-col gap-2">
        <ButtonGroup variant="tertiary">
          <Button>
            <ChevronLeft />
            Previous
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Next
            <ChevronRight />
          </Button>
        </ButtonGroup>
      </div>

      {/* Content Selection Button Group */}
      <div class="flex flex-col gap-2">
        <ButtonGroup variant="tertiary">
          <Button>
            <Picture />
            Photos
          </Button>
          <Button>
            <ButtonGroup.Separator />
            <Video />
            Videos
          </Button>
          <Button isIconOnly aria-label="More options">
            <ButtonGroup.Separator />
            <Ellipsis />
          </Button>
        </ButtonGroup>
      </div>

      {/* Text Alignment Button Group */}
      <div class="flex flex-col gap-2">
        <ButtonGroup variant="tertiary">
          <Button>Left</Button>
          <Button>
            <ButtonGroup.Separator />
            Center
          </Button>
          <Button>
            <ButtonGroup.Separator />
            Right
          </Button>
        </ButtonGroup>
      </div>

      {/* Icon-Only Alignment Button Group */}
      <div class="flex flex-col gap-2">
        <ButtonGroup variant="tertiary">
          <Button isIconOnly>
            <TextAlignLeft />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignCenter />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignRight />
          </Button>
          <Button isIconOnly>
            <ButtonGroup.Separator />
            <TextAlignJustify />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
