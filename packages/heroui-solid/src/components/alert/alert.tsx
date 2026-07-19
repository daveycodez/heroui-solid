import { type AlertVariants, alertVariants, cn } from "@heroui/styles"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  createContext,
  createMemo,
  type JSX,
  Match,
  Switch,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

import { DangerIcon, InfoIcon, SuccessIcon, WarningIcon } from "../icons"
import { SurfaceContext } from "../surface/surface"

/* ------------------------------------------------------------------------------------------------
 * Alert Context
 * --------------------------------------------------------------------------------------------- */
type AlertContextValue = {
  slots?: ReturnType<typeof alertVariants>
  status?: AlertVariants["status"]
}

const AlertContext = createContext<AlertContextValue>({})

/* ------------------------------------------------------------------------------------------------
 * Alert Root
 * --------------------------------------------------------------------------------------------- */
interface AlertRootProps extends AlertVariants {
  children?: JSX.Element
  class?: string
}

const AlertRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertRootProps>
) => {
  const [variantProps, local, rest] = splitProps(
    props as AlertRootProps,
    alertVariants.variantKeys,
    ["class"]
  )
  const slots = createMemo(() => alertVariants(variantProps))

  return (
    <AlertContext.Provider
      value={{
        get slots() {
          return slots()
        },
        get status() {
          return variantProps.status
        }
      }}
    >
      <SurfaceContext.Provider value={{ variant: "default" }}>
        <Polymorphic
          as="div"
          class={cn(slots().base(), local.class)}
          data-slot="alert-root"
          {...rest}
        />
      </SurfaceContext.Provider>
    </AlertContext.Provider>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Alert Indicator
 * --------------------------------------------------------------------------------------------- */
interface AlertIndicatorProps {
  children?: JSX.Element
  class?: string
}

// Status → default icon (default and accent share the info icon, as upstream).
// Switch/Match keeps the choice reactive to status changes (a bare switch in
// the component body reads status only once).
const DefaultIcon = (props: { status?: AlertVariants["status"] }) => (
  <Switch fallback={<InfoIcon data-slot="alert-default-icon" />}>
    <Match when={props.status === "success"}>
      <SuccessIcon data-slot="alert-default-icon" />
    </Match>
    <Match when={props.status === "warning"}>
      <WarningIcon data-slot="alert-default-icon" />
    </Match>
    <Match when={props.status === "danger"}>
      <DangerIcon data-slot="alert-default-icon" />
    </Match>
  </Switch>
)

const AlertIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertIndicatorProps>
) => {
  const [local, rest] = splitProps(props as AlertIndicatorProps, [
    "class",
    "children"
  ])
  const context = useContext(AlertContext)

  return (
    <Polymorphic
      as="div"
      class={cn(context.slots?.indicator(), local.class)}
      data-slot="alert-indicator"
      {...rest}
    >
      {local.children ?? <DefaultIcon status={context.status} />}
    </Polymorphic>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Alert Content
 * --------------------------------------------------------------------------------------------- */
interface AlertContentProps {
  children?: JSX.Element
  class?: string
}

const AlertContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, AlertContentProps>
) => {
  const [local, rest] = splitProps(props as AlertContentProps, ["class"])
  const context = useContext(AlertContext)

  return (
    <Polymorphic
      as="div"
      class={cn(context.slots?.content(), local.class)}
      data-slot="alert-content"
      {...rest}
    />
  )
}

/* ------------------------------------------------------------------------------------------------
 * Alert Title
 * --------------------------------------------------------------------------------------------- */
interface AlertTitleProps {
  children?: JSX.Element
  class?: string
}

const AlertTitle = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, AlertTitleProps>
) => {
  const [local, rest] = splitProps(props as AlertTitleProps, ["class"])
  const context = useContext(AlertContext)

  return (
    <Polymorphic
      as="p"
      class={cn(context.slots?.title(), local.class)}
      data-slot="alert-title"
      {...rest}
    />
  )
}

/* ------------------------------------------------------------------------------------------------
 * Alert Description
 * --------------------------------------------------------------------------------------------- */
interface AlertDescriptionProps {
  children?: JSX.Element
  class?: string
}

const AlertDescription = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AlertDescriptionProps>
) => {
  const [local, rest] = splitProps(props as AlertDescriptionProps, ["class"])
  const context = useContext(AlertContext)

  return (
    <Polymorphic
      as="span"
      class={cn(context.slots?.description(), local.class)}
      data-slot="alert-description"
      {...rest}
    />
  )
}

export type {
  AlertContentProps,
  AlertContextValue,
  AlertDescriptionProps,
  AlertIndicatorProps,
  AlertRootProps,
  AlertTitleProps
}
/* ------------------------------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------------------------- */
export {
  AlertContent,
  AlertContext,
  AlertDescription,
  AlertIndicator,
  AlertRoot,
  AlertTitle
}
