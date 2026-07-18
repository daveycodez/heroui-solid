import type { Component } from "solid-js"
import { Basic as AvatarBasic } from "./avatar/basic"
import { Colors as AvatarColors } from "./avatar/colors"
import { CustomStyles as AvatarCustomStyles } from "./avatar/custom-styles"
import { Fallback as AvatarFallback } from "./avatar/fallback"
import { Group as AvatarGroup } from "./avatar/group"
import { Sizes as AvatarSizes } from "./avatar/sizes"
import { Variants as AvatarVariants } from "./avatar/variants"
import { Basic } from "./button/basic"
import { CustomElement } from "./button/custom-element"
import { CustomVariants } from "./button/custom-variants"
import { Disabled } from "./button/disabled"
import { FullWidth } from "./button/full-width"
import { IconOnly } from "./button/icon-only"
import { Loading } from "./button/loading"
import { LoadingState } from "./button/loading-state"
import { Sizes } from "./button/sizes"
import { Social } from "./button/social"
import { Variants } from "./button/variants"
import { WithIcons } from "./button/with-icons"
import { Default as CardDefault } from "./card/default"
import { Horizontal as CardHorizontal } from "./card/horizontal"
import { Variants as CardVariants } from "./card/variants"
import { WithForm as CardWithForm } from "./card/with-form"
import { Basic as DescriptionBasic } from "./description/basic"
import { ControlledOpenState as DropdownControlledOpenState } from "./dropdown/controlled-open-state"
import { Default as DropdownDefault } from "./dropdown/default"
import { WithDescriptions as DropdownWithDescriptions } from "./dropdown/with-descriptions"
import { WithDisabledItems as DropdownWithDisabledItems } from "./dropdown/with-disabled-items"
import { WithIcons as DropdownWithIcons } from "./dropdown/with-icons"
import { Basic as FieldErrorBasic } from "./field-error/basic"
import { Basic as InputBasic } from "./input/basic"
import { Controlled as InputControlled } from "./input/controlled"
import { FullWidth as InputFullWidth } from "./input/full-width"
import { OnSurface as InputOnSurface } from "./input/on-surface"
import { Types as InputTypes } from "./input/types"
import { Variants as InputVariants } from "./input/variants"
import { Basic as KbdBasic } from "./kbd/basic"
import { InlineUsage as KbdInlineUsage } from "./kbd/inline"
import { InstructionalText as KbdInstructionalText } from "./kbd/instructional"
import { NavigationKeys as KbdNavigationKeys } from "./kbd/navigation"
import { SpecialKeys as KbdSpecialKeys } from "./kbd/special"
import { Variants as KbdVariants } from "./kbd/variants"
import { Basic as LabelBasic } from "./label/basic"
import { LinkBasic } from "./link/basic"
import { LinkCustomElement } from "./link/custom-element"
import { LinkCustomIcon } from "./link/custom-icon"
import { LinkIconPlacement } from "./link/icon-placement"
import { LinkUnderlineAndOffset } from "./link/underline-and-offset"
import { Controlled as ListBoxControlled } from "./list-box/controlled"
import { CustomCheckIcon as ListBoxCustomCheckIcon } from "./list-box/custom-check-icon"
import { Default as ListBoxDefault } from "./list-box/default"
import { MultiSelect as ListBoxMultiSelect } from "./list-box/multi-select"
import { ScrollbarModes as ListBoxScrollbarModes } from "./list-box/scrollbar-modes"
import { WithDisabledItems as ListBoxWithDisabledItems } from "./list-box/with-disabled-items"
import { WithSections as ListBoxWithSections } from "./list-box/with-sections"
import { Controlled as SelectControlled } from "./select/controlled"
import { CustomIndicator as SelectCustomIndicator } from "./select/custom-indicator"
import { Default as SelectDefault } from "./select/default"
import { Disabled as SelectDisabled } from "./select/disabled"
import { FullWidth as SelectFullWidth } from "./select/full-width"
import { MultipleSelect as SelectMultipleSelect } from "./select/multiple-select"
import { OnSurface as SelectOnSurface } from "./select/on-surface"
import { Variants as SelectVariants } from "./select/variants"
import { WithDisabledOptions as SelectWithDisabledOptions } from "./select/with-disabled-options"
import { Basic as SeparatorBasic } from "./separator/basic"
import { ManualVariantOverride as SeparatorManualVariantOverride } from "./separator/manual-variant-override"
import { Variants as SeparatorVariants } from "./separator/variants"
import { Vertical as SeparatorVertical } from "./separator/vertical"
import { WithContent as SeparatorWithContent } from "./separator/with-content"
import { WithSurface as SeparatorWithSurface } from "./separator/with-surface"
import { SpinnerBasic } from "./spinner/basic"
import { SpinnerColors } from "./spinner/colors"
import { SpinnerSizes } from "./spinner/sizes"
import { Variants as SurfaceVariants } from "./surface/variants"
import { Basic as TextAreaBasic } from "./textarea/basic"
import { Controlled as TextAreaControlled } from "./textarea/controlled"
import { FullWidth as TextAreaFullWidth } from "./textarea/full-width"
import { OnSurface as TextAreaOnSurface } from "./textarea/on-surface"
import { Rows as TextAreaRows } from "./textarea/rows"
import { Variants as TextAreaVariants } from "./textarea/variants"
import { Basic as TextFieldBasic } from "./textfield/basic"
import { Controlled as TextFieldControlled } from "./textfield/controlled"
import { Disabled as TextFieldDisabled } from "./textfield/disabled"
import { FullWidth as TextFieldFullWidth } from "./textfield/full-width"
import { InputTypes as TextFieldInputTypes } from "./textfield/input-types"
import { OnSurface as TextFieldOnSurface } from "./textfield/on-surface"
import { Required as TextFieldRequired } from "./textfield/required"
import { TextAreaExample as TextFieldTextArea } from "./textfield/textarea"
import { Validation as TextFieldValidation } from "./textfield/validation"
import { WithDescription as TextFieldWithDescription } from "./textfield/with-description"
import { WithError as TextFieldWithError } from "./textfield/with-error"

// Registry for <ComponentPreview name="..." /> in MDX pages. Follows the
// official HeroUI docs structure (apps/docs/src/demos/<component>/<demo>.tsx,
// referenced by "<component>-<demo>" name).
export const demos: Record<string, Component> = {
  "avatar-basic": AvatarBasic,
  "avatar-sizes": AvatarSizes,
  "avatar-colors": AvatarColors,
  "avatar-variants": AvatarVariants,
  "avatar-fallback": AvatarFallback,
  "avatar-group": AvatarGroup,
  "avatar-custom-styles": AvatarCustomStyles,
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
  "button-custom-element": CustomElement,
  "button-custom-variants": CustomVariants,
  "card-default": CardDefault,
  "card-variants": CardVariants,
  "card-horizontal": CardHorizontal,
  "card-with-form": CardWithForm,
  "description-basic": DescriptionBasic,
  "dropdown-default": DropdownDefault,
  "dropdown-with-icons": DropdownWithIcons,
  "dropdown-with-descriptions": DropdownWithDescriptions,
  "dropdown-with-disabled-items": DropdownWithDisabledItems,
  "dropdown-controlled-open-state": DropdownControlledOpenState,
  "field-error-basic": FieldErrorBasic,
  "input-basic": InputBasic,
  "input-types": InputTypes,
  "input-controlled": InputControlled,
  "input-full-width": InputFullWidth,
  "input-variants": InputVariants,
  "input-on-surface": InputOnSurface,
  "kbd-basic": KbdBasic,
  "kbd-navigation": KbdNavigationKeys,
  "kbd-inline": KbdInlineUsage,
  "kbd-instructional": KbdInstructionalText,
  "kbd-special": KbdSpecialKeys,
  "kbd-variants": KbdVariants,
  "label-basic": LabelBasic,
  "link-basic": LinkBasic,
  "link-custom-icon": LinkCustomIcon,
  "link-icon-placement": LinkIconPlacement,
  "link-underline-and-offset": LinkUnderlineAndOffset,
  "link-custom-element": LinkCustomElement,
  "list-box-default": ListBoxDefault,
  "list-box-with-sections": ListBoxWithSections,
  "list-box-multi-select": ListBoxMultiSelect,
  "list-box-with-disabled-items": ListBoxWithDisabledItems,
  "list-box-custom-check-icon": ListBoxCustomCheckIcon,
  "list-box-controlled": ListBoxControlled,
  "list-box-scrollbar-modes": ListBoxScrollbarModes,
  "select-default": SelectDefault,
  "select-multiple-select": SelectMultipleSelect,
  "select-with-disabled-options": SelectWithDisabledOptions,
  "select-custom-indicator": SelectCustomIndicator,
  "select-controlled": SelectControlled,
  "select-variants": SelectVariants,
  "select-full-width": SelectFullWidth,
  "select-on-surface": SelectOnSurface,
  "select-disabled": SelectDisabled,
  "separator-basic": SeparatorBasic,
  "separator-vertical": SeparatorVertical,
  "separator-with-content": SeparatorWithContent,
  "separator-variants": SeparatorVariants,
  "separator-with-surface": SeparatorWithSurface,
  "separator-manual-variant-override": SeparatorManualVariantOverride,
  "spinner-basic": SpinnerBasic,
  "spinner-colors": SpinnerColors,
  "spinner-sizes": SpinnerSizes,
  "surface-variants": SurfaceVariants,
  "textarea-basic": TextAreaBasic,
  "textarea-controlled": TextAreaControlled,
  "textarea-rows": TextAreaRows,
  "textarea-full-width": TextAreaFullWidth,
  "textarea-variants": TextAreaVariants,
  "textarea-on-surface": TextAreaOnSurface,
  "textfield-basic": TextFieldBasic,
  "textfield-with-description": TextFieldWithDescription,
  "textfield-required": TextFieldRequired,
  "textfield-validation": TextFieldValidation,
  "textfield-controlled": TextFieldControlled,
  "textfield-with-error": TextFieldWithError,
  "textfield-disabled": TextFieldDisabled,
  "textfield-textarea": TextFieldTextArea,
  "textfield-input-types": TextFieldInputTypes,
  "textfield-full-width": TextFieldFullWidth,
  "textfield-on-surface": TextFieldOnSurface
}
