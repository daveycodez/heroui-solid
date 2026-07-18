import { ListBox, Surface } from "heroui-solid"
import { For } from "solid-js"

type ScrollbarMode = {
  id: string
  label: string
  scrollbar?: "thin" | "default" | "none"
}

const modes: ScrollbarMode[] = [
  {
    id: "heroui",
    label: "HeroUI thin",
    scrollbar: "thin"
  },
  {
    id: "browser",
    label: "Browser default",
    scrollbar: "default"
  },
  {
    id: "hidden",
    label: "Hidden",
    scrollbar: "none"
  }
]

const animals = [
  { id: "aardvark", name: "Aardvark" },
  { id: "alpaca", name: "Alpaca" },
  { id: "antelope", name: "Antelope" },
  { id: "bear", name: "Bear" },
  { id: "cat", name: "Cat" },
  { id: "dog", name: "Dog" },
  { id: "fox", name: "Fox" },
  { id: "giraffe", name: "Giraffe" },
  { id: "kangaroo", name: "Kangaroo" },
  { id: "koala", name: "Koala" },
  { id: "lemur", name: "Lemur" },
  { id: "otter", name: "Otter" },
  { id: "panda", name: "Panda" },
  { id: "penguin", name: "Penguin" },
  { id: "rabbit", name: "Rabbit" },
  { id: "snake", name: "Snake" },
  { id: "turtle", name: "Turtle" },
  { id: "wombat", name: "Wombat" },
  { id: "zebra", name: "Zebra" }
]

function ScrollbarListBox(props: { mode: ScrollbarMode }) {
  return (
    <div class="flex w-[260px] flex-col gap-2">
      <h3 class="px-1 text-sm font-semibold text-muted">{props.mode.label}</h3>
      <Surface
        class="overflow-hidden rounded-3xl shadow-surface"
        data-scrollbar={props.mode.scrollbar}
      >
        <div class="h-52 scrollbar overflow-y-auto p-1">
          <ListBox
            aria-label={`${props.mode.label} animals`}
            selectionMode="single"
          >
            <For each={animals}>
              {(animal) => (
                <ListBox.Item
                  class="text-sm leading-5 font-medium"
                  id={`${props.mode.id}-${animal.id}`}
                  textValue={animal.name}
                >
                  {animal.name}
                </ListBox.Item>
              )}
            </For>
          </ListBox>
        </div>
      </Surface>
    </div>
  )
}

export function ScrollbarModes() {
  return (
    <div class="flex w-full flex-wrap justify-center gap-4">
      <For each={modes}>{(mode) => <ScrollbarListBox mode={mode} />}</For>
    </div>
  )
}
