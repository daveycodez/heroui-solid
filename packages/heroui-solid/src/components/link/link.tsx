import { cn, type LinkVariants, linkVariants } from "@heroui/styles"
import { Root as LinkPrimitive } from "@kobalte/core/link"
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  type ComponentProps,
  children,
  createContext,
  createMemo,
  type JSX,
  Show,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"

/* -------------------------------------------------------------------------------------------------
 * Link Context
 * -----------------------------------------------------------------------------------------------*/
interface LinkContextValue {
  slots?: ReturnType<typeof linkVariants>
}

const LinkContext = createContext<LinkContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Link Root
 * -----------------------------------------------------------------------------------------------*/
interface LinkRootProps extends LinkVariants {
  href?: string
  isDisabled?: boolean
  class?: string
  children?: JSX.Element
}

const LinkRoot = <T extends ValidComponent = "a">(
  props: PolymorphicProps<T, LinkRootProps>
) => {
  // linkVariants currently has no variants, so its variantKeys type collapses
  // to never[] — the cast keeps the split dynamic without hardcoding keys.
  const [variantProps, local, rest] = splitProps(
    props as LinkRootProps,
    linkVariants.variantKeys as ReadonlyArray<keyof LinkRootProps>,
    ["isDisabled", "class"]
  )
  const slots = createMemo(() => linkVariants(variantProps))

  return (
    <LinkContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <LinkPrimitive
        class={cn(slots().base(), local.class)}
        data-slot="link"
        disabled={local.isDisabled}
        {...rest}
      />
    </LinkContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Link Icon
 * -----------------------------------------------------------------------------------------------*/
const ExternalLinkIcon = (props: ComponentProps<"svg">) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={9}
    role="presentation"
    viewBox="0 0 7 7"
    width={9}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z"
      fill="currentColor"
    />
  </svg>
)

interface LinkIconProps {
  class?: string
  children?: JSX.Element
}

const LinkIcon = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, LinkIconProps>
) => {
  const [local, rest] = splitProps(props as LinkIconProps, [
    "class",
    "children"
  ])
  const context = useContext(LinkContext)
  const resolved = children(() => local.children)

  return (
    <Polymorphic
      as="span"
      class={cn(context.slots?.icon(), local.class)}
      data-default-icon={resolved() ? undefined : "true"}
      data-slot="link-icon"
      {...rest}
    >
      <Show
        when={resolved()}
        fallback={<ExternalLinkIcon data-slot="link-default-icon" />}
      >
        {resolved()}
      </Show>
    </Polymorphic>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { LinkIconProps, LinkRootProps }
export { LinkIcon, LinkRoot }
