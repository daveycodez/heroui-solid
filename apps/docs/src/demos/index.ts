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
import { BackdropVariants as AlertDialogBackdropVariants } from "./alert-dialog/backdrop-variants"
import { CloseMethods as AlertDialogCloseMethods } from "./alert-dialog/close-methods"
import { Controlled as AlertDialogControlled } from "./alert-dialog/controlled"
import { CustomAnimations as AlertDialogCustomAnimations } from "./alert-dialog/custom-animations"
import { CustomBackdrop as AlertDialogCustomBackdrop } from "./alert-dialog/custom-backdrop"
import { CustomIcon as AlertDialogCustomIcon } from "./alert-dialog/custom-icon"
import { CustomPortal as AlertDialogCustomPortal } from "./alert-dialog/custom-portal"
import { CustomTrigger as AlertDialogCustomTrigger } from "./alert-dialog/custom-trigger"
import { Default as AlertDialogDefault } from "./alert-dialog/default"
import { DismissBehavior as AlertDialogDismissBehavior } from "./alert-dialog/dismiss-behavior"
import { Placements as AlertDialogPlacements } from "./alert-dialog/placements"
import { Sizes as AlertDialogSizes } from "./alert-dialog/sizes"
import { Statuses as AlertDialogStatuses } from "./alert-dialog/statuses"
import { WithCloseButton as AlertDialogWithCloseButton } from "./alert-dialog/with-close-button"
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
import { OutlineVariant } from "./button/outline-variant"
import { Ripple as ButtonRipple } from "./button/ripple"
import { Sizes } from "./button/sizes"
import { Social } from "./button/social"
import { Variants } from "./button/variants"
import { WithIcons } from "./button/with-icons"
import { Basic as ButtonGroupBasic } from "./button-group/basic"
import { Disabled as ButtonGroupDisabled } from "./button-group/disabled"
import { FullWidth as ButtonGroupFullWidth } from "./button-group/full-width"
import { Orientation as ButtonGroupOrientation } from "./button-group/orientation"
import { Sizes as ButtonGroupSizes } from "./button-group/sizes"
import { Variants as ButtonGroupVariants } from "./button-group/variants"
import { WithIcons as ButtonGroupWithIcons } from "./button-group/with-icons"
import { WithoutSeparator as ButtonGroupWithoutSeparator } from "./button-group/without-separator"
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
import { LongPressTrigger as DropdownLongPressTrigger } from "./dropdown/long-press-trigger"
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
import { Controlled as ListBoxControlled } from "./list-box/controlled"
import { CustomCheckIcon as ListBoxCustomCheckIcon } from "./list-box/custom-check-icon"
import { Default as ListBoxDefault } from "./list-box/default"
import { MultiSelect as ListBoxMultiSelect } from "./list-box/multi-select"
import { ScrollbarModes as ListBoxScrollbarModes } from "./list-box/scrollbar-modes"
import { WithDisabledItems as ListBoxWithDisabledItems } from "./list-box/with-disabled-items"
import { WithSections as ListBoxWithSections } from "./list-box/with-sections"
import { CustomSize as ScrollShadowCustomSize } from "./scroll-shadow/custom-size"
import { Default as ScrollShadowDefault } from "./scroll-shadow/default"
import { HideScrollBar as ScrollShadowHideScrollBar } from "./scroll-shadow/hide-scroll-bar"
import { Orientation as ScrollShadowOrientation } from "./scroll-shadow/orientation"
import { VisibilityChange as ScrollShadowVisibilityChange } from "./scroll-shadow/visibility-change"
import { WithCard as ScrollShadowWithCard } from "./scroll-shadow/with-card"
import { Basic as SearchFieldBasic } from "./search-field/basic"
import { Controlled as SearchFieldControlled } from "./search-field/controlled"
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
import { Controlled as SelectControlled } from "./select/controlled"
import { ControlledMultiple as SelectControlledMultiple } from "./select/controlled-multiple"
import { ControlledOpenState as SelectControlledOpenState } from "./select/controlled-open-state"
import { CustomIndicator as SelectCustomIndicator } from "./select/custom-indicator"
import { CustomValue as SelectCustomValue } from "./select/custom-value"
import { CustomValueMultiple as SelectCustomValueMultiple } from "./select/custom-value-multiple"
import { Default as SelectDefault } from "./select/default"
import { Disabled as SelectDisabled } from "./select/disabled"
import { FullWidth as SelectFullWidth } from "./select/full-width"
import { MultipleSelect as SelectMultipleSelect } from "./select/multiple-select"
import { OnSurface as SelectOnSurface } from "./select/on-surface"
import { Required as SelectRequired } from "./select/required"
import { Variants as SelectVariants } from "./select/variants"
import { WithDescription as SelectWithDescription } from "./select/with-description"
import { WithDisabledOptions as SelectWithDisabledOptions } from "./select/with-disabled-options"
import { WithSections as SelectWithSections } from "./select/with-sections"
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
import { TagGroupBasic } from "./tag-group/basic"
import { TagGroupControlled } from "./tag-group/controlled"
import { TagGroupDisabled } from "./tag-group/disabled"
import { TagGroupSelectionModes } from "./tag-group/selection-modes"
import { TagGroupSizes } from "./tag-group/sizes"
import { TagGroupVariants } from "./tag-group/variants"
import { TagGroupWithErrorMessage } from "./tag-group/with-error-message"
import { TagGroupWithPrefix } from "./tag-group/with-prefix"
import { TagGroupWithRemoveButton } from "./tag-group/with-remove-button"
import { AutoResize as TextAreaAutoResize } from "./textarea/auto-resize"
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
import { TooltipBasic } from "./tooltip/basic"
import { TooltipCustomElement } from "./tooltip/custom-element"
import { TooltipCustomTrigger } from "./tooltip/custom-trigger"
import { TooltipPlacement } from "./tooltip/placement"
import { TooltipWithArrow } from "./tooltip/with-arrow"

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
  "alert-dialog-default": AlertDialogDefault,
  "alert-dialog-statuses": AlertDialogStatuses,
  "alert-dialog-placements": AlertDialogPlacements,
  "alert-dialog-backdrop-variants": AlertDialogBackdropVariants,
  "alert-dialog-sizes": AlertDialogSizes,
  "alert-dialog-custom-icon": AlertDialogCustomIcon,
  "alert-dialog-custom-backdrop": AlertDialogCustomBackdrop,
  "alert-dialog-dismiss-behavior": AlertDialogDismissBehavior,
  "alert-dialog-close-methods": AlertDialogCloseMethods,
  "alert-dialog-controlled": AlertDialogControlled,
  "alert-dialog-custom-trigger": AlertDialogCustomTrigger,
  "alert-dialog-custom-animations": AlertDialogCustomAnimations,
  "alert-dialog-custom-portal": AlertDialogCustomPortal,
  "alert-dialog-with-close-button": AlertDialogWithCloseButton,
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
  "button-outline-variant": OutlineVariant,
  "button-ripple": ButtonRipple,
  "button-sizes": Sizes,
  "button-full-width": FullWidth,
  "button-disabled": Disabled,
  "button-social": Social,
  "button-custom-element": CustomElement,
  "button-custom-variants": CustomVariants,
  "button-group-basic": ButtonGroupBasic,
  "button-group-variants": ButtonGroupVariants,
  "button-group-sizes": ButtonGroupSizes,
  "button-group-orientation": ButtonGroupOrientation,
  "button-group-with-icons": ButtonGroupWithIcons,
  "button-group-full-width": ButtonGroupFullWidth,
  "button-group-disabled": ButtonGroupDisabled,
  "button-group-without-separator": ButtonGroupWithoutSeparator,
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
  "dropdown-with-single-selection": DropdownWithSingleSelection,
  "dropdown-single-with-custom-indicator": DropdownSingleWithCustomIndicator,
  "dropdown-with-multiple-selection": DropdownWithMultipleSelection,
  "dropdown-with-section-level-selection": DropdownWithSectionLevelSelection,
  "dropdown-with-keyboard-shortcuts": DropdownWithKeyboardShortcuts,
  "dropdown-with-icons": DropdownWithIcons,
  "dropdown-long-press-trigger": DropdownLongPressTrigger,
  "dropdown-with-descriptions": DropdownWithDescriptions,
  "dropdown-with-sections": DropdownWithSections,
  "dropdown-with-disabled-items": DropdownWithDisabledItems,
  "dropdown-with-submenus": DropdownWithSubmenus,
  "dropdown-with-custom-submenu-indicator": DropdownWithCustomSubmenuIndicator,
  "dropdown-controlled": DropdownControlled,
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
  "select-controlled-multiple": SelectControlledMultiple,
  "select-controlled-open-state": SelectControlledOpenState,
  "select-custom-value": SelectCustomValue,
  "select-custom-value-multiple": SelectCustomValueMultiple,
  "select-required": SelectRequired,
  "select-with-description": SelectWithDescription,
  "select-with-sections": SelectWithSections,
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
  "tag-group-basic": TagGroupBasic,
  "tag-group-sizes": TagGroupSizes,
  "tag-group-variants": TagGroupVariants,
  "tag-group-disabled": TagGroupDisabled,
  "tag-group-controlled": TagGroupControlled,
  "tag-group-selection-modes": TagGroupSelectionModes,
  "tag-group-with-prefix": TagGroupWithPrefix,
  "tag-group-with-remove-button": TagGroupWithRemoveButton,
  "tag-group-with-error-message": TagGroupWithErrorMessage,
  "tooltip-basic": TooltipBasic,
  "tooltip-with-arrow": TooltipWithArrow,
  "tooltip-placement": TooltipPlacement,
  "tooltip-custom-trigger": TooltipCustomTrigger,
  "tooltip-custom-element": TooltipCustomElement
}
