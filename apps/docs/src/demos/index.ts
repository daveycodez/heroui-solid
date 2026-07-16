import type { Component } from "solid-js"
import { Basic } from "./button/basic"
import { CustomElement } from "./button/custom-element"
import { Disabled } from "./button/disabled"
import { FullWidth } from "./button/full-width"
import { IconOnly } from "./button/icon-only"
import { Loading } from "./button/loading"
import { LoadingState } from "./button/loading-state"
import { Sizes } from "./button/sizes"
import { Social } from "./button/social"
import { Variants } from "./button/variants"
import { WithIcons } from "./button/with-icons"

// Registry for <ComponentPreview name="..." /> in MDX pages. Follows the
// official HeroUI docs structure (apps/docs/src/demos/<component>/<demo>.tsx,
// referenced by "<component>-<demo>" name).
export const demos: Record<string, Component> = {
  "button-basic": Basic,
  "button-variants": Variants,
  "button-with-icons": WithIcons,
  "button-icon-only": IconOnly,
  "button-loading": Loading,
  "button-loading-state": LoadingState,
  "button-sizes": Sizes,
  "button-full-width": FullWidth,
  "button-disabled": Disabled,
  "button-social": Social,
  "button-custom-element": CustomElement
}
