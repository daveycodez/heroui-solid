import { Dialog } from "@kobalte/core/dialog"
import { type AnyOrama, create, insertMultiple, search } from "@orama/orama"
import { A, useNavigate } from "@solidjs/router"
import { FileText, Hashtag, Magnifier } from "gravity-icons-solid"
import { Kbd, PreventScroll, Spinner } from "heroui-solid"
import {
  createEffect,
  createResource,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  Show
} from "solid-js"
import type { SearchRecord } from "../../search-index"

// Solid take on the official HeroUI docs search (fumadocs' SearchToggle /
// SearchDialog restyled): the header triggers open a ⌘K dialog that fetches
// the prerendered /api/search index once and queries Orama in the browser —
// the same static-search setup fumadocs uses, with heroui-solid tokens for
// the chrome. The open signal lives at module scope so the desktop bar, the
// mobile icon button, and the dialog (all mounted separately in header.tsx)
// share it.

const [open, setOpen] = createSignal(false)

type SearchIndex = {
  db: AnyOrama
  pages: SearchRecord[]
}

let indexPromise: Promise<SearchIndex> | undefined

const loadIndex = (): Promise<SearchIndex> =>
  (indexPromise ??= (async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}api/search`)
    if (!response.ok) {
      throw new Error(`Search index request failed (${response.status})`)
    }
    const records: SearchRecord[] = await response.json()
    const db = create({
      schema: { title: "string", page: "string", content: "string" }
    })
    await insertMultiple(db, records)
    const pages = records
      .filter((record) => record.kind === "page")
      .sort(
        (a, b) =>
          Number(a.url.includes("/components/")) -
          Number(b.url.includes("/components/"))
      )
    return { db, pages }
  })().catch((error) => {
    // Don't cache the failure — the next open (or retry) refetches.
    indexPromise = undefined
    throw error
  }))

export function SearchButton() {
  return (
    <button
      type="button"
      class="search-toggle my-auto inline-flex w-full items-center gap-2 p-1.5 ps-2.5 text-sm transition-colors"
      onClick={() => setOpen(true)}
    >
      <Magnifier class="size-4" />
      Search
      <div class="ms-auto inline-flex gap-0.5">
        <Kbd class="rounded-md">
          <Kbd.Abbr keyValue="command" />
        </Kbd>
        <Kbd class="rounded-md">
          <Kbd.Content>K</Kbd.Content>
        </Kbd>
      </div>
    </button>
  )
}

export function SearchIconButton() {
  return (
    <button
      type="button"
      aria-label="Open search"
      class="search-toggle-icon inline-flex items-center justify-center rounded-md p-2 transition-colors md:hidden"
      onClick={() => setOpen(true)}
    >
      <Magnifier class="size-5" />
    </button>
  )
}

const optionId = (index: number) => `docs-search-option-${index}`

export function SearchDialog() {
  const navigate = useNavigate()
  const [query, setQuery] = createSignal("")
  const [selected, setSelected] = createSignal(0)

  const [index, { refetch: refetchIndex }] = createResource(open, (isOpen) =>
    isOpen ? loadIndex() : null
  )
  const [hits] = createResource(
    () => {
      // Reading an errored resource throws; the error branch renders inline.
      const idx = index.error ? undefined : index()
      return idx ? { idx, q: query() } : null
    },
    async ({ idx, q }) => {
      const term = q.trim()
      if (!term) {
        return idx.pages
      }
      const results = await search(idx.db, {
        term,
        properties: ["title", "page", "content"],
        boost: { title: 4, page: 2 },
        tolerance: 1,
        limit: 12
      })
      return results.hits.map((hit) => hit.document as unknown as SearchRecord)
    }
  )
  const items = () => hits.latest ?? []

  createEffect(on(items, () => setSelected(0)))
  createEffect(() => {
    document
      .getElementById(optionId(selected()))
      ?.scrollIntoView({ block: "nearest" })
  })

  const go = (item: SearchRecord) => {
    setOpen(false)
    navigate(item.url)
  }

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((wasOpen) => !wasOpen)
      }
    }
    document.addEventListener("keydown", onKey)
    onCleanup(() => document.removeEventListener("keydown", onKey))
  })

  const onInputKeyDown = (event: KeyboardEvent) => {
    const list = items()
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (list.length === 0) {
        return
      }
      const delta = event.key === "ArrowDown" ? 1 : -1
      setSelected((current) => (current + delta + list.length) % list.length)
    } else if (event.key === "Enter") {
      const item = list[selected()]
      if (item) {
        go(item)
      }
    }
  }

  return (
    <Dialog open={open()} onOpenChange={setOpen} preventScroll={false}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-backdrop" />
        <div class="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
          <Dialog.Content class="flex w-full max-w-[550px] flex-col overflow-hidden rounded-2xl border border-border bg-overlay text-overlay-foreground shadow-2xl">
            <PreventScroll />
            <div class="flex items-center gap-2.5 border-b border-border px-4">
              <Magnifier class="size-4 shrink-0 text-muted" />
              <input
                role="combobox"
                aria-expanded="true"
                aria-controls="docs-search-listbox"
                aria-activedescendant={optionId(selected())}
                aria-label="Search documentation"
                class="h-12 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-field-placeholder"
                placeholder="What are you searching for?"
                value={query()}
                onInput={(event) => setQuery(event.currentTarget.value)}
                onKeyDown={onInputKeyDown}
              />
              <Kbd class="rounded-md border border-border bg-background px-1.5 text-xs">
                <Kbd.Content>Esc</Kbd.Content>
              </Kbd>
            </div>
            <div
              id="docs-search-listbox"
              role="listbox"
              aria-label="Search results"
              class="max-h-[50vh] overflow-y-auto p-2"
            >
              <Show
                when={!index.error}
                fallback={
                  <div class="flex flex-col items-center gap-3 py-12 text-sm text-muted">
                    Search couldn’t load.
                    <button
                      type="button"
                      class="rounded-lg border border-border px-3 py-1.5 text-foreground transition-colors hover:bg-default-soft"
                      onClick={() => refetchIndex()}
                    >
                      Try again
                    </button>
                  </div>
                }
              >
                <Show
                  when={items().length > 0}
                  fallback={
                    <div class="flex justify-center py-12 text-sm text-muted">
                      <Show
                        when={!index.loading && !hits.loading}
                        fallback={<Spinner />}
                      >
                        No results found for “{query().trim()}”
                      </Show>
                    </div>
                  }
                >
                  <Show when={query().trim() === ""}>
                    <div class="px-2.5 pb-1 pt-1.5 text-xs text-muted">
                      Jump to
                    </div>
                  </Show>
                  <For each={items()}>
                    {(item, itemIndex) => (
                      <A
                        id={optionId(itemIndex())}
                        role="option"
                        aria-selected={selected() === itemIndex()}
                        data-active={
                          selected() === itemIndex() ? "" : undefined
                        }
                        class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted no-underline data-active:bg-default-soft data-active:text-foreground"
                        href={item.url}
                        onClick={() => setOpen(false)}
                        onMouseMove={() => setSelected(itemIndex())}
                      >
                        <Show
                          when={item.kind === "heading"}
                          fallback={<FileText class="size-4 shrink-0" />}
                        >
                          <Hashtag class="size-4 shrink-0" />
                        </Show>
                        <span class="min-w-0">
                          <span class="block truncate">{item.title}</span>
                          <Show when={item.kind === "heading"}>
                            <span class="block truncate text-xs opacity-70">
                              {item.page}
                            </span>
                          </Show>
                        </span>
                      </A>
                    )}
                  </For>
                </Show>
              </Show>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  )
}
