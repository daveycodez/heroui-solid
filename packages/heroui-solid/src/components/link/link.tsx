import { cn, linkVariants } from "@heroui/styles"
import { Link } from "@kobalte/core/link"
import {
  type ComponentProps,
  children,
  createContext,
  createMemo,
  splitProps,
  useContext,
  type ValidComponent
} from "solid-js"
import { ExternalLinkIcon } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * Link Context
 * -----------------------------------------------------------------------------------------------*/
type LinkContextValue = {
  slots?: ReturnType<typeof linkVariants>
}

const LinkContext = createContext<LinkContextValue>({})

/* -------------------------------------------------------------------------------------------------
 * Link Root
 * -----------------------------------------------------------------------------------------------*/
type LinkRootProps<T extends ValidComponent = "a"> = ComponentProps<
  typeof Link<T>
>

const LinkRoot = <T extends ValidComponent = "a">(props: LinkRootProps<T>) => {
  const [local, rest] = splitProps(props as LinkRootProps, ["class"])
  const slots = createMemo(() => linkVariants())

  return (
    <LinkContext.Provider
      value={{
        get slots() {
          return slots()
        }
      }}
    >
      <Link
        class={cn(slots().base(), local.class)}
        data-slot="link"
        {...rest}
      />
    </LinkContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Link Icon
 * -----------------------------------------------------------------------------------------------*/
interface LinkIconProps extends ComponentProps<"span"> {}

const LinkIcon = (props: LinkIconProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const resolved = children(() => local.children)
  const context = useContext(LinkContext)

  // data-default-icon drives upstream's default-icon spacing (link.css); omit it
  // when the caller supplies their own icon.
  return (
    <span
      class={cn(context.slots?.icon(), local.class)}
      data-default-icon={resolved() ? undefined : "true"}
      data-slot="link-icon"
      {...rest}
    >
      {resolved() ?? (
        <ExternalLinkIcon aria-hidden="true" data-slot="link-default-icon" />
      )}
    </span>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Exports
 * -----------------------------------------------------------------------------------------------*/
export type { LinkIconProps, LinkRootProps }
export { LinkIcon, LinkRoot }
