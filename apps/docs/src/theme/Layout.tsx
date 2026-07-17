import { useCurrentPageData } from "@kobalte/solidbase/client"
import DefaultLayout from "@kobalte/solidbase/default-theme/Layout"
import { createEffect, onCleanup } from "solid-js"

// Wraps the default solidbase layout to give the "On This Page" panel the
// official HeroUI docs behavior: a 1px foreground thumb that glides along
// the rail (fumadocs' TocThumb) plus our own scroll-spy driving a
// `toc-active` class. Solidbase's TableOfContents is not overridable
// through the theme componentsPath (only Layout and mdx-components are),
// and its built-in scroll-spy can never reach headings that sit in the
// last viewport-height of the page (it requires scrollY to pass the
// heading itself, and the page runs out of scroll first) — so the spy is
// reimplemented here with the official bottom clamp, and everything is
// grafted onto the DOM after hydration so SSR markup stays untouched.
// Styling lives in docs-theme.css (.toc-thumb / .toc-active; solidbase's
// own active color is neutralized there).

let detach: (() => void) | undefined

function attachTocSpy() {
  detach?.()
  const nav = document.querySelector<HTMLElement>("article > aside nav")
  const list = nav?.querySelector("ol")
  if (!nav || !list) {
    return
  }
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href*="#"]')]
  if (links.length === 0) {
    return
  }
  const thumb = document.createElement("div")
  thumb.className = "toc-thumb"
  thumb.setAttribute("aria-hidden", "true")
  nav.appendChild(thumb)

  let frame: number | undefined
  const update = () => {
    frame = undefined
    const doc = document.documentElement
    const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4
    let index = 0
    if (atBottom) {
      index = links.length - 1
    } else {
      for (let i = 0; i < links.length; i++) {
        const hash = links[i].getAttribute("href")?.split("#")[1]
        const heading =
          hash && document.getElementById(decodeURIComponent(hash))
        if (!heading) {
          continue
        }
        if (heading.getBoundingClientRect().top <= 100) {
          index = i
        } else {
          break
        }
      }
    }
    const active = links[index]
    for (const link of links) {
      link.classList.toggle("toc-active", link === active)
    }
    const navRect = nav.getBoundingClientRect()
    const linkRect = active.getBoundingClientRect()
    thumb.style.top = `${linkRect.top - navRect.top}px`
    thumb.style.height = `${linkRect.height}px`
    thumb.style.left = `${list.getBoundingClientRect().left - navRect.left}px`
    thumb.style.opacity = "1"
  }
  const schedule = () => {
    frame ??= requestAnimationFrame(update)
  }
  update()

  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  detach = () => {
    if (frame !== undefined) {
      cancelAnimationFrame(frame)
    }
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
    thumb.remove()
    detach = undefined
  }
}

export default function Layout(
  props: Parameters<typeof DefaultLayout>[0]
): ReturnType<typeof DefaultLayout> {
  const pageData = useCurrentPageData()
  createEffect(() => {
    pageData() // re-attach when the page (and its TOC) changes
    // Double rAF: the TOC renders in this flush; measure after paint.
    requestAnimationFrame(() => requestAnimationFrame(attachTocSpy))
  })
  onCleanup(() => detach?.())
  return <DefaultLayout {...props} />
}
