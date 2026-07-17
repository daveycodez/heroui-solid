import type { Component } from "solid-js"
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
import { Basic as LabelBasic } from "./label/basic"
import { LinkBasic } from "./link/basic"
import { LinkCustomElement } from "./link/custom-element"
import { LinkCustomIcon } from "./link/custom-icon"
import { LinkIconPlacement } from "./link/icon-placement"
import { LinkUnderlineAndOffset } from "./link/underline-and-offset"
import { Controlled as SelectControlled } from "./select/controlled"
import { CustomIndicator as SelectCustomIndicator } from "./select/custom-indicator"
import { Default as SelectDefault } from "./select/default"
import { Disabled as SelectDisabled } from "./select/disabled"
import { FullWidth as SelectFullWidth } from "./select/full-width"
import { MultipleSelect as SelectMultipleSelect } from "./select/multiple-select"
import { OnSurface as SelectOnSurface } from "./select/on-surface"
import { Variants as SelectVariants } from "./select/variants"
import { WithDisabledOptions as SelectWithDisabledOptions } from "./select/with-disabled-options"
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
  "label-basic": LabelBasic,
  "link-basic": LinkBasic,
  "link-custom-icon": LinkCustomIcon,
  "link-icon-placement": LinkIconPlacement,
  "link-underline-and-offset": LinkUnderlineAndOffset,
  "link-custom-element": LinkCustomElement,
  "select-default": SelectDefault,
  "select-multiple-select": SelectMultipleSelect,
  "select-with-disabled-options": SelectWithDisabledOptions,
  "select-custom-indicator": SelectCustomIndicator,
  "select-controlled": SelectControlled,
  "select-variants": SelectVariants,
  "select-full-width": SelectFullWidth,
  "select-on-surface": SelectOnSurface,
  "select-disabled": SelectDisabled,
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
