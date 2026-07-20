import type { Component } from "solid-js"
import { Basic as AccordionBasic } from "./accordion/basic"
import { Controlled as AccordionControlled } from "./accordion/controlled"
import { CustomElement as AccordionCustomElement } from "./accordion/custom-element"
import { CustomIndicator as AccordionCustomIndicator } from "./accordion/custom-indicator"
import { CustomStyles as AccordionCustomStyles } from "./accordion/custom-styles"
import { Disabled as AccordionDisabled } from "./accordion/disabled"
import { FAQ as AccordionFAQ } from "./accordion/faq"
import { Multiple as AccordionMultiple } from "./accordion/multiple"
import { Surface as AccordionSurface } from "./accordion/surface"
import { WithoutSeparator as AccordionWithoutSeparator } from "./accordion/without-separator"
import { Basic as AlertBasic } from "./alert/basic"
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
import { WithAvatar as CardWithAvatar } from "./card/with-avatar"
import { WithForm as CardWithForm } from "./card/with-form"
import { WithImages as CardWithImages } from "./card/with-images"
import { ChipBasic } from "./chip/basic"
import { ChipStatuses } from "./chip/statuses"
import { ChipVariants } from "./chip/variants"
import { ChipVibrantPalette } from "./chip/vibrant-palette"
import { ChipWithIcon } from "./chip/with-icon"
import { Default as CloseButtonDefault } from "./close-button/default"
import { Interactive as CloseButtonInteractive } from "./close-button/interactive"
import { Variants as CloseButtonVariants } from "./close-button/variants"
import { WithCustomIcon as CloseButtonWithCustomIcon } from "./close-button/with-custom-icon"
import { Basic as DescriptionBasic } from "./description/basic"
import { Controlled as DropdownControlled } from "./dropdown/controlled"
import { ControlledOpenState as DropdownControlledOpenState } from "./dropdown/controlled-open-state"
import { CustomTrigger as DropdownCustomTrigger } from "./dropdown/custom-trigger"
import { Default as DropdownDefault } from "./dropdown/default"
import { SingleWithCustomIndicator as DropdownSingleWithCustomIndicator } from "./dropdown/single-with-custom-indicator"
import { WithCustomSubmenuIndicator as DropdownWithCustomSubmenuIndicator } from "./dropdown/with-custom-submenu-indicator"
import { WithDescriptions as DropdownWithDescriptions } from "./dropdown/with-descriptions"
import { WithDisabledItems as DropdownWithDisabledItems } from "./dropdown/with-disabled-items"
import { WithIcons as DropdownWithIcons } from "./dropdown/with-icons"
import { WithKeyboardShortcuts as DropdownWithKeyboardShortcuts } from "./dropdown/with-keyboard-shortcuts"
import { WithMultipleSelection as DropdownWithMultipleSelection } from "./dropdown/with-multiple-selection"
import { WithSectionLevelSelection as DropdownWithSectionLevelSelection } from "./dropdown/with-section-level-selection"
import { WithSections as DropdownWithSections } from "./dropdown/with-sections"
import { WithSingleSelection as DropdownWithSingleSelection } from "./dropdown/with-single-selection"
import { WithSubmenus as DropdownWithSubmenus } from "./dropdown/with-submenus"
import { ErrorMessageBasic } from "./error-message/basic"
import { Basic as FieldErrorBasic } from "./field-error/basic"
import { Basic as FormBasic } from "./form/basic"
import { Basic as InputBasic } from "./input/basic"
import { Controlled as InputControlled } from "./input/controlled"
import { FullWidth as InputFullWidth } from "./input/full-width"
import { OnSurface as InputOnSurface } from "./input/on-surface"
import { Types as InputTypes } from "./input/types"
import { Variants as InputVariants } from "./input/variants"
import { Default as InputGroupDefault } from "./input-group/default"
import { Disabled as InputGroupDisabled } from "./input-group/disabled"
import { FullWidth as InputGroupFullWidth } from "./input-group/full-width"
import { Invalid as InputGroupInvalid } from "./input-group/invalid"
import { OnSurface as InputGroupOnSurface } from "./input-group/on-surface"
import { PasswordWithToggle as InputGroupPasswordWithToggle } from "./input-group/password-with-toggle"
import { Required as InputGroupRequired } from "./input-group/required"
import { Variants as InputGroupVariants } from "./input-group/variants"
import { WithBadgeSuffix as InputGroupWithBadgeSuffix } from "./input-group/with-badge-suffix"
import { WithCopySuffix as InputGroupWithCopySuffix } from "./input-group/with-copy-suffix"
import { WithIconPrefixAndCopySuffix as InputGroupWithIconPrefixAndCopySuffix } from "./input-group/with-icon-prefix-and-copy-suffix"
import { WithIconPrefixAndTextSuffix as InputGroupWithIconPrefixAndTextSuffix } from "./input-group/with-icon-prefix-and-text-suffix"
import { WithKeyboardShortcut as InputGroupWithKeyboardShortcut } from "./input-group/with-keyboard-shortcut"
import { WithLoadingSuffix as InputGroupWithLoadingSuffix } from "./input-group/with-loading-suffix"
import { WithPrefixAndSuffix as InputGroupWithPrefixAndSuffix } from "./input-group/with-prefix-and-suffix"
import { WithPrefixIcon as InputGroupWithPrefixIcon } from "./input-group/with-prefix-icon"
import { WithSuffixIcon as InputGroupWithSuffixIcon } from "./input-group/with-suffix-icon"
import { WithTextPrefix as InputGroupWithTextPrefix } from "./input-group/with-text-prefix"
import { WithTextSuffix as InputGroupWithTextSuffix } from "./input-group/with-text-suffix"
import { WithTextArea as InputGroupWithTextArea } from "./input-group/with-textarea"
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
import { LinkUnderlineOffset } from "./link/underline-offset"
import { LinkUnderlineVariants } from "./link/underline-variants"
import { CustomSize as ScrollShadowCustomSize } from "./scroll-shadow/custom-size"
import { Default as ScrollShadowDefault } from "./scroll-shadow/default"
import { HideScrollBar as ScrollShadowHideScrollBar } from "./scroll-shadow/hide-scroll-bar"
import { Orientation as ScrollShadowOrientation } from "./scroll-shadow/orientation"
import { VisibilityChange as ScrollShadowVisibilityChange } from "./scroll-shadow/visibility-change"
import { WithCard as ScrollShadowWithCard } from "./scroll-shadow/with-card"
import { Basic as SearchFieldBasic } from "./search-field/basic"
import { Controlled as SearchFieldControlled } from "./search-field/controlled"
import { CustomElement as SearchFieldCustomElement } from "./search-field/custom-element"
import { CustomIcons as SearchFieldCustomIcons } from "./search-field/custom-icons"
import { Disabled as SearchFieldDisabled } from "./search-field/disabled"
import { FormExample as SearchFieldFormExample } from "./search-field/form-example"
import { FullWidth as SearchFieldFullWidth } from "./search-field/full-width"
import { OnSurface as SearchFieldOnSurface } from "./search-field/on-surface"
import { Required as SearchFieldRequired } from "./search-field/required"
import { Validation as SearchFieldValidation } from "./search-field/validation"
import { Variants as SearchFieldVariants } from "./search-field/variants"
import { WithDescription as SearchFieldWithDescription } from "./search-field/with-description"
import { WithKeyboardShortcut as SearchFieldWithKeyboardShortcut } from "./search-field/with-keyboard-shortcut"
import { WithValidation as SearchFieldWithValidation } from "./search-field/with-validation"
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
import { Basic as TabsBasic } from "./tabs/basic"
import { CustomElement as TabsCustomElement } from "./tabs/custom-element"
import { CustomStyles as TabsCustomStyles } from "./tabs/custom-styles"
import { Disabled as TabsDisabled } from "./tabs/disabled"
import { Overflow as TabsOverflow } from "./tabs/overflow"
import { Secondary as TabsSecondary } from "./tabs/secondary"
import { SecondaryVertical as TabsSecondaryVertical } from "./tabs/secondary-vertical"
import { Vertical as TabsVertical } from "./tabs/vertical"
import { WithSeparator as TabsWithSeparator } from "./tabs/with-separator"
import { AutoResize as TextAreaAutoResize } from "./textarea/auto-resize"
import { Basic as TextAreaBasic } from "./textarea/basic"
import { Controlled as TextAreaControlled } from "./textarea/controlled"
import { FullWidth as TextAreaFullWidth } from "./textarea/full-width"
import { Invalid as TextAreaInvalid } from "./textarea/invalid"
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
import { TooltipBasic } from "./tooltip/basic"
import { TooltipCustomElement } from "./tooltip/custom-element"
import { TooltipCustomTrigger } from "./tooltip/custom-trigger"
import { TooltipPlacement } from "./tooltip/placement"
import { TooltipWithArrow } from "./tooltip/with-arrow"
import { TooltipWithoutPortal } from "./tooltip/without-portal"

// Registry for <ComponentPreview name="..." /> in MDX pages. Follows the
// official HeroUI docs structure (apps/docs/src/demos/<component>/<demo>.tsx,
// referenced by "<component>-<demo>" name).
export const demos: Record<string, Component> = {
  "accordion-basic": AccordionBasic,
  "accordion-controlled": AccordionControlled,
  "accordion-custom-element": AccordionCustomElement,
  "accordion-custom-indicator": AccordionCustomIndicator,
  "accordion-custom-styles": AccordionCustomStyles,
  "accordion-disabled": AccordionDisabled,
  "accordion-faq": AccordionFAQ,
  "accordion-multiple": AccordionMultiple,
  "accordion-surface": AccordionSurface,
  "accordion-without-separator": AccordionWithoutSeparator,
  "alert-basic": AlertBasic,
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
  "card-with-avatar": CardWithAvatar,
  "card-with-images": CardWithImages,
  "card-with-form": CardWithForm,
  "chip-basic": ChipBasic,
  "chip-variants": ChipVariants,
  "chip-with-icon": ChipWithIcon,
  "chip-statuses": ChipStatuses,
  "chip-vibrant-palette": ChipVibrantPalette,
  "close-button-default": CloseButtonDefault,
  "close-button-with-custom-icon": CloseButtonWithCustomIcon,
  "close-button-interactive": CloseButtonInteractive,
  "close-button-variants": CloseButtonVariants,
  "description-basic": DescriptionBasic,
  "dropdown-default": DropdownDefault,
  "dropdown-with-keyboard-shortcuts": DropdownWithKeyboardShortcuts,
  "dropdown-with-icons": DropdownWithIcons,
  "dropdown-with-descriptions": DropdownWithDescriptions,
  "dropdown-with-sections": DropdownWithSections,
  "dropdown-with-disabled-items": DropdownWithDisabledItems,
  "dropdown-with-single-selection": DropdownWithSingleSelection,
  "dropdown-single-with-custom-indicator": DropdownSingleWithCustomIndicator,
  "dropdown-with-multiple-selection": DropdownWithMultipleSelection,
  "dropdown-controlled": DropdownControlled,
  "dropdown-with-section-level-selection": DropdownWithSectionLevelSelection,
  "dropdown-with-submenus": DropdownWithSubmenus,
  "dropdown-with-custom-submenu-indicator": DropdownWithCustomSubmenuIndicator,
  "dropdown-controlled-open-state": DropdownControlledOpenState,
  "dropdown-custom-trigger": DropdownCustomTrigger,
  "error-message-basic": ErrorMessageBasic,
  "field-error-basic": FieldErrorBasic,
  "form-basic": FormBasic,
  "input-basic": InputBasic,
  "input-types": InputTypes,
  "input-controlled": InputControlled,
  "input-full-width": InputFullWidth,
  "input-variants": InputVariants,
  "input-on-surface": InputOnSurface,
  "input-group-default": InputGroupDefault,
  "input-group-with-prefix-icon": InputGroupWithPrefixIcon,
  "input-group-with-suffix-icon": InputGroupWithSuffixIcon,
  "input-group-with-prefix-and-suffix": InputGroupWithPrefixAndSuffix,
  "input-group-with-text-prefix": InputGroupWithTextPrefix,
  "input-group-with-text-suffix": InputGroupWithTextSuffix,
  "input-group-with-icon-prefix-and-text-suffix":
    InputGroupWithIconPrefixAndTextSuffix,
  "input-group-with-copy-suffix": InputGroupWithCopySuffix,
  "input-group-with-icon-prefix-and-copy-suffix":
    InputGroupWithIconPrefixAndCopySuffix,
  "input-group-password-with-toggle": InputGroupPasswordWithToggle,
  "input-group-with-loading-suffix": InputGroupWithLoadingSuffix,
  "input-group-with-keyboard-shortcut": InputGroupWithKeyboardShortcut,
  "input-group-with-badge-suffix": InputGroupWithBadgeSuffix,
  "input-group-required": InputGroupRequired,
  "input-group-invalid": InputGroupInvalid,
  "input-group-disabled": InputGroupDisabled,
  "input-group-full-width": InputGroupFullWidth,
  "input-group-variants": InputGroupVariants,
  "input-group-on-surface": InputGroupOnSurface,
  "input-group-with-textarea": InputGroupWithTextArea,
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
  "link-underline-offset": LinkUnderlineOffset,
  "link-underline-variants": LinkUnderlineVariants,
  "link-custom-element": LinkCustomElement,
  "scroll-shadow-default": ScrollShadowDefault,
  "scroll-shadow-orientation": ScrollShadowOrientation,
  "scroll-shadow-hide-scroll-bar": ScrollShadowHideScrollBar,
  "scroll-shadow-custom-size": ScrollShadowCustomSize,
  "scroll-shadow-visibility-change": ScrollShadowVisibilityChange,
  "scroll-shadow-with-card": ScrollShadowWithCard,
  "search-field-basic": SearchFieldBasic,
  "search-field-with-description": SearchFieldWithDescription,
  "search-field-required": SearchFieldRequired,
  "search-field-validation": SearchFieldValidation,
  "search-field-disabled": SearchFieldDisabled,
  "search-field-controlled": SearchFieldControlled,
  "search-field-with-validation": SearchFieldWithValidation,
  "search-field-custom-icons": SearchFieldCustomIcons,
  "search-field-custom-element": SearchFieldCustomElement,
  "search-field-full-width": SearchFieldFullWidth,
  "search-field-variants": SearchFieldVariants,
  "search-field-on-surface": SearchFieldOnSurface,
  "search-field-form-example": SearchFieldFormExample,
  "search-field-with-keyboard-shortcut": SearchFieldWithKeyboardShortcut,
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
  "textarea-auto-resize": TextAreaAutoResize,
  "textarea-full-width": TextAreaFullWidth,
  "textarea-variants": TextAreaVariants,
  "textarea-on-surface": TextAreaOnSurface,
  "textarea-invalid": TextAreaInvalid,
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
  "textfield-on-surface": TextFieldOnSurface,
  "tabs-basic": TabsBasic,
  "tabs-vertical": TabsVertical,
  "tabs-overflow": TabsOverflow,
  "tabs-disabled": TabsDisabled,
  "tabs-custom-styles": TabsCustomStyles,
  "tabs-with-separator": TabsWithSeparator,
  "tabs-secondary": TabsSecondary,
  "tabs-secondary-vertical": TabsSecondaryVertical,
  "tabs-custom-element": TabsCustomElement,
  "tooltip-basic": TooltipBasic,
  "tooltip-with-arrow": TooltipWithArrow,
  "tooltip-placement": TooltipPlacement,
  "tooltip-custom-trigger": TooltipCustomTrigger,
  "tooltip-custom-element": TooltipCustomElement,
  "tooltip-without-portal": TooltipWithoutPortal
}
