# Ripple (parked experiment)

The Material 3 ripple that used to live inside `heroui-solid`'s `Button`. It was
pulled out so the `Button` component can stay a thin Kobalte pass-through — this
folder is a parked experiment: nothing in the package or docs imports it, and
it's not re-exported from the package entry.

## Files

- `ripple.ts` — `createRipple()`, a Solid hook returning `{ onClick,
  onPointerDown, onPointerUp, onPointerLeave, onPointerCancel }` to spread onto
  an element. Drives the expand-and-fade animation via the Web Animations API.
- `ripple.css` — the passive `::after` canvas + the `--button-ripple` opt-in
  flag. Apply `.ripple-target` to a positioned element; arm it with `.ripple`
  (or `:root { --button-ripple: 1 }` for all), disarm one with `.no-ripple`.
- `ripple-button.tsx` — a standalone `<button>` wired up with the handlers.

## Behavior

Expands from the press point and follows Material 3's touch heuristics: mouse
and pen ripple immediately on press, keyboard activation ripples from the
center, and a touch only ripples once it's clearly a tap or hold — a touch that
turns into a scroll never fires it. Uses `currentColor` and honors
`prefers-reduced-motion`; tune with `--button-ripple-color` and
`--button-ripple-opacity`.

## Re-integrating with `<Button>`

`Button` intercepts `on:click` for its pending guard, so you can't pass a second
`on:click`. To layer ripple back on, wrap `Button` and merge the ripple's
`onClick` into the button's handler, then forward the four pointer handlers.
