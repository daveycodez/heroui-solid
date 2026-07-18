/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { isIOS } from "@kobalte/utils"
import { onCleanup } from "solid-js"
import { isServer } from "solid-js/web"

// Ported from React Aria's usePreventScroll (@react-aria/overlays) so
// overlays lock scrolling the way upstream HeroUI does: overflow: hidden on
// the root element (html), not body — Kobalte's own lock targets body, which
// breaks position: sticky in the page — plus the Mobile Safari work-arounds
// below (see AGENTS.md).

const isScrollable = (node: Element | null, checkForOverflow?: boolean) => {
  if (!node) {
    return false
  }
  const style = window.getComputedStyle(node)
  const root = document.scrollingElement || document.documentElement
  let scrollable = /(auto|scroll)/.test(
    style.overflow + style.overflowX + style.overflowY
  )
  // Root element has `visible` overflow by default, but is scrollable
  // nonetheless.
  if (node === root && style.overflow !== "hidden") {
    scrollable = true
  }
  if (scrollable && checkForOverflow) {
    scrollable =
      node.scrollHeight !== node.clientHeight ||
      node.scrollWidth !== node.clientWidth
  }
  return scrollable
}

const getScrollParent = (node: Element, checkForOverflow?: boolean) => {
  let scrollableNode: Element | null = node
  if (isScrollable(scrollableNode, checkForOverflow)) {
    scrollableNode = scrollableNode.parentElement
  }
  while (scrollableNode && !isScrollable(scrollableNode, checkForOverflow)) {
    scrollableNode = scrollableNode.parentElement
  }
  return scrollableNode || document.scrollingElement || document.documentElement
}

// HTML input types that do not cause the software keyboard to appear.
const nonTextInputTypes = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
])

const willOpenKeyboard = (target: Element) =>
  (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
  target instanceof HTMLTextAreaElement ||
  (target instanceof HTMLElement && target.isContentEditable)

const getEventTarget = (e: Event): Element => {
  const path = e.composedPath()
  return (path[0] as Element) ?? (e.target as Element)
}

const getNonce = () => {
  const meta = document.querySelector('meta[property="csp-nonce"]')
  return (
    (meta instanceof HTMLMetaElement && (meta.nonce || meta.content)) ||
    undefined
  )
}

// Sets a CSS property on an element, and returns a function to revert it to
// the previous value.
const setStyle = (element: HTMLElement, property: string, value: string) => {
  const cur = element.style.getPropertyValue(property)
  element.style.setProperty(property, value)
  return () => {
    if (cur) {
      element.style.setProperty(property, cur)
    } else {
      element.style.removeProperty(property)
    }
  }
}

// Adds an event listener, and returns a function to remove it.
const addEvent = <K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (e: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
) => {
  target.addEventListener(event, handler, options)
  return () => {
    target.removeEventListener(event, handler, options)
  }
}

const scrollIntoView = (target: Element) => {
  const visualViewport = window.visualViewport
  const root = document.scrollingElement || document.documentElement
  let nextTarget: Element | null = target
  while (nextTarget && nextTarget !== root) {
    // Find the parent scrollable element and adjust the scroll position if
    // the target is not already in view.
    const scrollable = getScrollParent(nextTarget)
    if (
      scrollable !== document.documentElement &&
      scrollable !== document.body &&
      scrollable !== nextTarget
    ) {
      const scrollableRect = scrollable.getBoundingClientRect()
      const targetRect = nextTarget.getBoundingClientRect()
      if (
        targetRect.top < scrollableRect.top ||
        targetRect.bottom > scrollableRect.top + nextTarget.clientHeight
      ) {
        let bottom = scrollableRect.bottom
        if (visualViewport) {
          bottom = Math.min(
            bottom,
            visualViewport.offsetTop + visualViewport.height
          )
        }
        // Center within the viewport.
        const adjustment =
          targetRect.top -
          scrollableRect.top -
          ((bottom - scrollableRect.top) / 2 - targetRect.height / 2)
        scrollable.scrollTo({
          // Clamp to the valid range to prevent over-scrolling.
          top: Math.max(
            0,
            Math.min(
              scrollable.scrollHeight - scrollable.clientHeight,
              scrollable.scrollTop + adjustment
            )
          ),
          behavior: "smooth"
        })
      }
    }
    nextTarget = scrollable.parentElement
  }
}

const scrollIntoViewWhenReady = (
  target: Element,
  wasKeyboardVisible: boolean
) => {
  const visualViewport = window.visualViewport
  if (wasKeyboardVisible || !visualViewport) {
    // If the keyboard was already visible, scroll the target into view
    // immediately.
    scrollIntoView(target)
  } else {
    // Otherwise, wait for the visual viewport to resize before scrolling so
    // we can measure the correct position to scroll to.
    visualViewport.addEventListener("resize", () => scrollIntoView(target), {
      once: true
    })
  }
}

// For most browsers, all we need to do is set `overflow: hidden` on the root
// element, and add some padding to prevent the page from shifting when the
// scrollbar is hidden.
const preventScrollStandard = () => {
  const root = document.documentElement
  const scrollbarWidth = window.innerWidth - root.clientWidth
  const restorers = [
    scrollbarWidth > 0 &&
      // Use scrollbar-gutter when supported because it also works for fixed
      // positioned elements.
      ("scrollbarGutter" in root.style
        ? setStyle(root, "scrollbar-gutter", "stable")
        : setStyle(root, "padding-right", `${scrollbarWidth}px`)),
    setStyle(root, "overflow", "hidden")
  ]
  return () => {
    for (const restore of restorers) {
      if (restore) {
        restore()
      }
    }
  }
}

// Mobile Safari is a whole different beast. Even with overflow: hidden, it
// still scrolls the page in many situations. See React Aria's
// usePreventScroll for the full commentary; this ports its work-arounds:
//
// 1. Prevent default on `touchmove` events that are not in a scrollable
//    element.
// 2. Set `overscroll-behavior: contain` on nested scrollable regions (via an
//    injected stylesheet — it must apply before the touchstart as of iOS 26),
//    working around elements that don't actually overflow by preventing
//    default in `touchmove`.
// 3. On blur/focus into inputs, focus with preventScroll and scroll the
//    input into view ourselves so Safari doesn't scroll the whole page to
//    reveal the keyboard.
const preventScrollMobileSafari = () => {
  const restoreOverflow = setStyle(
    document.documentElement,
    "overflow",
    "hidden"
  )
  let scrollable: Element | undefined
  let allowTouchMove = false

  const onTouchStart = (e: TouchEvent) => {
    // Store the nearest scrollable parent element from the element that the
    // user touched.
    const target = getEventTarget(e)
    scrollable = isScrollable(target) ? target : getScrollParent(target, true)
    allowTouchMove = false
    // If the target is selected, don't preventDefault in touchmove to allow
    // the user to adjust the selection.
    const selection = target.ownerDocument.defaultView?.getSelection()
    if (
      selection &&
      !selection.isCollapsed &&
      selection.containsNode(target, true)
    ) {
      allowTouchMove = true
    }
    // If this is a range input, allow touch move so the user can adjust the
    // slider value.
    if (
      e
        .composedPath()
        .some((el) => el instanceof HTMLInputElement && el.type === "range")
    ) {
      allowTouchMove = true
    }
    // If this is a focused input element with a selected range, allow the
    // user to drag the selection handles.
    if (
      (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement) &&
      target.selectionStart != null &&
      target.selectionEnd != null &&
      target.selectionStart < target.selectionEnd &&
      target.ownerDocument.activeElement === target
    ) {
      allowTouchMove = true
    }
  }

  // Prevent scrolling up when at the top and scrolling down when at the
  // bottom of a nested scrollable area, otherwise Mobile Safari will start
  // scrolling the window instead. This must apply before the touchstart
  // event as of iOS 26, so inject it as a <style> element.
  const style = document.createElement("style")
  const nonce = getNonce()
  if (nonce) {
    style.nonce = nonce
  }
  style.textContent = `
@layer {
  * {
    overscroll-behavior: contain;
  }
}`.trim()
  document.head.prepend(style)

  const onTouchMove = (e: TouchEvent) => {
    // Allow pinch-zooming.
    if (e.touches.length === 2 || allowTouchMove) {
      return
    }
    // Prevent scrolling the window.
    if (
      !scrollable ||
      scrollable === document.documentElement ||
      scrollable === document.body
    ) {
      e.preventDefault()
      return
    }
    // overscroll-behavior should prevent scroll chaining, but currently does
    // not if the element doesn't actually overflow.
    // https://bugs.webkit.org/show_bug.cgi?id=243452
    // This checks that both the width and height do not overflow, otherwise
    // we might block horizontal scrolling too. In that case, adding
    // `touch-action: pan-x` to the element will prevent vertical page
    // scrolling (it must be set before the touchstart event).
    if (
      scrollable.scrollHeight === scrollable.clientHeight &&
      scrollable.scrollWidth === scrollable.clientWidth
    ) {
      e.preventDefault()
    }
  }

  const onBlur = (e: FocusEvent) => {
    const target = getEventTarget(e)
    const relatedTarget = e.relatedTarget as Element | null
    if (relatedTarget && willOpenKeyboard(relatedTarget)) {
      // Focus without scrolling the whole page, and then scroll into view
      // manually.
      ;(relatedTarget as HTMLElement).focus({ preventScroll: true })
      scrollIntoViewWhenReady(relatedTarget, willOpenKeyboard(target))
    } else if (!relatedTarget) {
      // When tapping the Done button on the keyboard, focus moves to the
      // body, and focus restoration will move it back to the input. Later,
      // when tapping the same input again, it is already focused, so no blur
      // event fires and Safari's native scrolling occurs. Instead, move
      // focus to the parent focusable element (e.g. the dialog).
      const focusable = target.parentElement?.closest<HTMLElement>("[tabindex]")
      focusable?.focus({ preventScroll: true })
    }
  }

  // Override programmatic focus to scroll into view without scrolling the
  // whole page.
  const focus = HTMLElement.prototype.focus
  HTMLElement.prototype.focus = function (
    this: HTMLElement,
    opts?: FocusOptions
  ) {
    // Track whether the keyboard was already visible before.
    const activeElement = document.activeElement
    const wasKeyboardVisible =
      activeElement != null && willOpenKeyboard(activeElement)
    // Focus the element without scrolling the page.
    focus.call(this, { ...opts, preventScroll: true })
    if (!opts?.preventScroll) {
      scrollIntoViewWhenReady(this, wasKeyboardVisible)
    }
  }

  const removeEvents = [
    addEvent(document, "touchstart", onTouchStart, {
      passive: false,
      capture: true
    }),
    addEvent(document, "touchmove", onTouchMove, {
      passive: false,
      capture: true
    }),
    addEvent(document, "blur", onBlur, { capture: true })
  ]

  return () => {
    restoreOverflow()
    for (const remove of removeEvents) {
      remove()
    }
    style.remove()
    HTMLElement.prototype.focus = focus
  }
}

// The number of active locks; the page style is restored when the last one
// releases.
let lockCount = 0
let restore: (() => void) | undefined

// Render inside a portal'd content component so the lock spans exactly the
// content's presence. SSR-inert.
const PreventScroll = () => {
  if (isServer) {
    return null
  }
  if (lockCount === 0) {
    restore = isIOS() ? preventScrollMobileSafari() : preventScrollStandard()
  }
  lockCount++
  onCleanup(() => {
    lockCount--
    if (lockCount === 0) {
      restore?.()
      restore = undefined
    }
  })
  return null
}

export { PreventScroll }
