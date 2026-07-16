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
import { CardHorizontal } from "./card/horizontal"
import { CardUsage } from "./card/usage"
import { CardVariants } from "./card/variants"
import { CardWithForm } from "./card/with-form"
import { DescriptionBasic } from "./description/basic"
import { DropdownControlledOpenState } from "./dropdown/controlled-open-state"
import { DropdownDisabledItems } from "./dropdown/disabled-items"
import { DropdownUsage } from "./dropdown/usage"
import { DropdownWithDescriptions } from "./dropdown/with-descriptions"
import { DropdownWithIcons } from "./dropdown/with-icons"
import { FieldErrorBasic } from "./field-error/basic"
import { InputBasic } from "./input/basic"
import { InputControlled } from "./input/controlled"
import { InputFullWidth } from "./input/full-width"
import { InputInSurface } from "./input/in-surface"
import { InputTypes } from "./input/types"
import { InputVariants } from "./input/variants"
import { LabelBasic } from "./label/basic"
import { SelectControlled } from "./select/controlled"
import { SelectCustomIndicator } from "./select/custom-indicator"
import { SelectDisabled } from "./select/disabled"
import { SelectDisabledOptions } from "./select/disabled-options"
import { SelectFullWidth } from "./select/full-width"
import { SelectInSurface } from "./select/in-surface"
import { SelectMultiple } from "./select/multiple"
import { SelectUsage } from "./select/usage"
import { SelectVariants } from "./select/variants"
import { SpinnerBasic } from "./spinner/basic"
import { SpinnerColors } from "./spinner/colors"
import { SpinnerSizes } from "./spinner/sizes"
import { SurfaceVariants } from "./surface/variants"
import { TextAreaBasic } from "./textarea/basic"
import { TextAreaControlled } from "./textarea/controlled"
import { TextAreaFullWidth } from "./textarea/full-width"
import { TextAreaInSurface } from "./textarea/in-surface"
import { TextAreaRows } from "./textarea/rows"
import { TextAreaVariants } from "./textarea/variants"
import { TextFieldBasic } from "./textfield/basic"
import { TextFieldControlled } from "./textfield/controlled"
import { TextFieldDisabled } from "./textfield/disabled"
import { TextFieldErrorMessage } from "./textfield/error-message"
import { TextFieldFullWidth } from "./textfield/full-width"
import { TextFieldInSurface } from "./textfield/in-surface"
import { TextFieldInputTypes } from "./textfield/input-types"
import { TextFieldRequired } from "./textfield/required"
import { TextFieldTextArea } from "./textfield/textarea"
import { TextFieldValidation } from "./textfield/validation"
import { TextFieldWithDescription } from "./textfield/with-description"

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
  "card-usage": CardUsage,
  "card-variants": CardVariants,
  "card-horizontal": CardHorizontal,
  "card-with-form": CardWithForm,
  "description-basic": DescriptionBasic,
  "dropdown-usage": DropdownUsage,
  "dropdown-with-icons": DropdownWithIcons,
  "dropdown-with-descriptions": DropdownWithDescriptions,
  "dropdown-disabled-items": DropdownDisabledItems,
  "dropdown-controlled-open-state": DropdownControlledOpenState,
  "field-error-basic": FieldErrorBasic,
  "input-basic": InputBasic,
  "input-types": InputTypes,
  "input-controlled": InputControlled,
  "input-full-width": InputFullWidth,
  "input-variants": InputVariants,
  "input-in-surface": InputInSurface,
  "label-basic": LabelBasic,
  "select-usage": SelectUsage,
  "select-multiple": SelectMultiple,
  "select-disabled-options": SelectDisabledOptions,
  "select-custom-indicator": SelectCustomIndicator,
  "select-controlled": SelectControlled,
  "select-variants": SelectVariants,
  "select-full-width": SelectFullWidth,
  "select-in-surface": SelectInSurface,
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
  "textarea-in-surface": TextAreaInSurface,
  "textfield-basic": TextFieldBasic,
  "textfield-with-description": TextFieldWithDescription,
  "textfield-required": TextFieldRequired,
  "textfield-validation": TextFieldValidation,
  "textfield-controlled": TextFieldControlled,
  "textfield-error-message": TextFieldErrorMessage,
  "textfield-disabled": TextFieldDisabled,
  "textfield-textarea": TextFieldTextArea,
  "textfield-input-types": TextFieldInputTypes,
  "textfield-full-width": TextFieldFullWidth,
  "textfield-in-surface": TextFieldInSurface
}
