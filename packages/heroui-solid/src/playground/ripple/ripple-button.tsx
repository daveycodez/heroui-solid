import type { JSX } from "solid-js"
import { createRipple } from "./ripple"

// Standalone demo of the extracted ripple on a plain button. Spread the ripple
// handlers onto any `.ripple-target` element and add `.ripple` to arm it.
//
// To layer it back onto heroui-solid's <Button>, compose the ripple's onClick
// with the button's own click handler (the button intercepts on:click for its
// pending guard, so you can't just pass two) and forward the pointer handlers.
export function RippleButton(props: {
  children?: JSX.Element
  class?: string
}): JSX.Element {
  const ripple = createRipple()
  return (
    <button
      class={`ripple-target ripple ${props.class ?? ""}`}
      on:click={ripple.onClick}
      on:pointercancel={ripple.onPointerCancel}
      on:pointerdown={ripple.onPointerDown}
      on:pointerleave={ripple.onPointerLeave}
      on:pointerup={ripple.onPointerUp}
      type="button"
    >
      {props.children}
    </button>
  )
}
