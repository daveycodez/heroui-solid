import { createEffect, on, onCleanup, onMount } from "solid-js"

interface DisclosurePanelOptions {
  element: () => HTMLElement | undefined
  isExpanded: () => boolean
  expand: () => void
}

// Port of React Aria's useDisclosure panel effect (react-aria 3.x): HeroUI's
// panel CSS animates `height: var(--disclosure-panel-height)` on a panel that
// stays mounted while collapsed (`hidden="until-found"`), so this drives those
// custom properties on a Kobalte force-mounted content element. `expand` is
// called when the browser reveals hidden content via find-in-page
// (`beforematch`).
function createDisclosurePanel(options: DisclosurePanelOptions): void {
  let raf: number | undefined

  const cancelRaf = () => {
    if (raf !== undefined) {
      cancelAnimationFrame(raf)
      raf = undefined
    }
  }

  onMount(() => {
    const panel = options.element()

    if (!panel) {
      return
    }

    // Initial state, without animation.
    if (options.isExpanded()) {
      panel.removeAttribute("hidden")
      panel.style.setProperty("--disclosure-panel-width", "auto")
      panel.style.setProperty("--disclosure-panel-height", "auto")
    } else {
      panel.setAttribute("hidden", "until-found")
      panel.style.setProperty("--disclosure-panel-width", "0px")
      panel.style.setProperty("--disclosure-panel-height", "0px")
    }

    const onBeforeMatch = () => {
      // Wait a frame to revert the browser's removal of the hidden attribute;
      // the expansion effect below cancels this when state actually changes.
      // Cancel any still-pending frame first so a re-fire can't leave an
      // orphaned callback that re-hides the panel after it expands.
      cancelRaf()
      raf = requestAnimationFrame(() => {
        panel.setAttribute("hidden", "until-found")
      })
      options.expand()
    }

    panel.addEventListener("beforematch", onBeforeMatch)
    onCleanup(() => {
      panel.removeEventListener("beforematch", onBeforeMatch)
      cancelRaf()
    })

    createEffect(
      on(
        options.isExpanded,
        (expanded) => {
          cancelRaf()

          // Kobalte's collapsible parks transition-duration/animation-name
          // inline ("0s"/"none") on content mounted open; clear before
          // animating.
          panel.style.removeProperty("transition-duration")
          panel.style.removeProperty("animation-name")

          if (typeof panel.getAnimations !== "function") {
            // No Web Animations support (jsdom): jump to the final state.
            if (expanded) {
              panel.removeAttribute("hidden")
              panel.style.setProperty("--disclosure-panel-width", "auto")
              panel.style.setProperty("--disclosure-panel-height", "auto")
            } else {
              panel.setAttribute("hidden", "until-found")
              panel.style.setProperty("--disclosure-panel-width", "0px")
              panel.style.setProperty("--disclosure-panel-height", "0px")
            }
            return
          }

          if (expanded) {
            panel.removeAttribute("hidden")

            // Set the width and height as pixels so they can be animated.
            panel.style.setProperty(
              "--disclosure-panel-width",
              `${panel.scrollWidth}px`
            )
            panel.style.setProperty(
              "--disclosure-panel-height",
              `${panel.scrollHeight}px`
            )

            Promise.all(panel.getAnimations().map((a) => a.finished))
              .then(() => {
                // After the animations complete, switch back to auto so the
                // content can resize.
                panel.style.setProperty("--disclosure-panel-width", "auto")
                panel.style.setProperty("--disclosure-panel-height", "auto")
              })
              .catch(() => {})
          } else {
            panel.style.setProperty(
              "--disclosure-panel-width",
              `${panel.scrollWidth}px`
            )
            panel.style.setProperty(
              "--disclosure-panel-height",
              `${panel.scrollHeight}px`
            )

            // Force style re-calculation to trigger the transition.
            void getComputedStyle(panel).height

            panel.style.setProperty("--disclosure-panel-width", "0px")
            panel.style.setProperty("--disclosure-panel-height", "0px")

            // Wait for animations to apply the hidden attribute.
            Promise.all(panel.getAnimations().map((a) => a.finished))
              .then(() => panel.setAttribute("hidden", "until-found"))
              .catch(() => {})
          }
        },
        { defer: true }
      )
    )
  })
}

export { createDisclosurePanel }
