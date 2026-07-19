import { cn, type TextAreaVariants, textAreaVariants } from "@heroui/styles"
import { FormControlContext } from "@kobalte/core"
import { TextArea } from "@kobalte/core/text-field"
import { callHandler, mergeRefs } from "@kobalte/utils"
import {
  type ComponentProps,
  createEffect,
  type JSX,
  mergeProps,
  on,
  splitProps,
  useContext
} from "solid-js"

import { TextFieldContext } from "../textfield"

/* -------------------------------------------------------------------------------------------------
 * TextArea Root
 * -----------------------------------------------------------------------------------------------*/
interface TextAreaRootProps
  extends ComponentProps<"textarea">,
    TextAreaVariants {
  autoResize?: boolean
  submitOnEnter?: boolean
}

// autoResize/submitOnEnter are Kobalte TextArea props; the standalone <textarea>
// fallback (no FormControlContext) has to reimplement them. Ported verbatim from
// Kobalte's TextArea, with the field-value subscription replaced by an onInput
// adjust since there's no FormControlContext value to track here.
function adjustHeight(el: HTMLTextAreaElement) {
  const prevAlignment = el.style.alignSelf
  const prevOverflow = el.style.overflow
  const isFirefox = "MozAppearance" in el.style
  if (!isFirefox) {
    el.style.overflow = "hidden"
  }
  el.style.alignSelf = "start"
  el.style.height = "auto"
  el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`
  el.style.overflow = prevOverflow
  el.style.alignSelf = prevAlignment
}

const TextAreaRoot = (props: TextAreaRootProps) => {
  const [variantProps, local, rest] = splitProps(
    props,
    textAreaVariants.variantKeys,
    ["class"]
  )
  const formControl = useContext(FormControlContext)
  const textFieldContext = useContext(TextFieldContext)

  // Use variant from context if not explicitly provided
  const resolvedVariants = mergeProps(variantProps, {
    get variant() {
      return variantProps.variant ?? textFieldContext.variant
    }
  })

  // Kobalte's TextArea consumes autoResize/submitOnEnter itself, so they ride
  // through the spread here.
  if (formControl) {
    return (
      <TextArea
        class={cn(textAreaVariants(resolvedVariants), local.class)}
        data-slot="textarea"
        {...(rest as ComponentProps<typeof TextArea>)}
      />
    )
  }

  // Standalone <textarea>: the native element has neither, so reimplement them.
  // Peel autoResize/submitOnEnter (not valid DOM attrs) and the handlers we
  // compose with off `rest` so the spread doesn't leak or clobber them.
  const [extras, others] = splitProps(rest, [
    "autoResize",
    "submitOnEnter",
    "ref",
    "onInput",
    "onKeyPress"
  ])

  let ref: HTMLTextAreaElement | undefined

  createEffect(
    on(
      [() => ref, () => extras.autoResize, () => others.value],
      ([el, autoResize]) => {
        if (!el || !autoResize) {
          return
        }
        adjustHeight(el)
      }
    )
  )

  const onInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (
    event
  ) => {
    // onInput on a textarea is Solid's InputEventHandlerUnion (target narrowed
    // to the element); callHandler wants the general EventHandlerUnion.
    callHandler(
      event,
      extras.onInput as JSX.EventHandlerUnion<HTMLTextAreaElement, InputEvent>
    )
    if (ref && extras.autoResize) {
      adjustHeight(ref)
    }
  }

  const onKeyPress: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (
    event
  ) => {
    callHandler(event, extras.onKeyPress)
    if (
      ref &&
      extras.submitOnEnter &&
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      if (ref.form) {
        ref.form.requestSubmit()
        event.preventDefault()
      }
    }
  }

  return (
    <textarea
      ref={mergeRefs((el) => {
        ref = el
      }, extras.ref)}
      class={cn(textAreaVariants(resolvedVariants), local.class)}
      data-slot="textarea"
      aria-multiline={extras.submitOnEnter ? "false" : undefined}
      onInput={onInput}
      onKeyPress={onKeyPress}
      {...others}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { TextAreaRootProps }
export { TextAreaRoot }
