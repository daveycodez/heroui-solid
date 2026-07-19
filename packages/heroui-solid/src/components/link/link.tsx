import { cn, linkVariants } from "@heroui/styles"
import { Link } from "@kobalte/core/link"
import {
  type ComponentProps,
  children,
  splitProps,
  type ValidComponent
} from "solid-js"
import { ExternalLinkIcon } from "../icons"

/* -------------------------------------------------------------------------------------------------
 * Link Root
 * -----------------------------------------------------------------------------------------------*/
type LinkRootProps<T extends ValidComponent = "a"> = ComponentProps<
  typeof Link<T>
>

const LinkRoot = <T extends ValidComponent = "a">(props: LinkRootProps<T>) => {
  const [local, rest] = splitProps(props as LinkRootProps, ["class"])

  return (
    <Link
      class={cn(linkVariants().base(), local.class)}
      data-slot="link"
      {...rest}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Link Icon
 * -----------------------------------------------------------------------------------------------*/
interface LinkIconProps extends ComponentProps<"span"> {}

const LinkIcon = (props: LinkIconProps) => {
  const [local, rest] = splitProps(props, ["class", "children"])
  const resolved = children(() => local.children)

  // data-default-icon drives upstream's default-icon spacing (link.css); omit it
  // when the caller supplies their own icon.
  return (
    <span
      class={cn(linkVariants().icon(), local.class)}
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

export type { LinkIconProps, LinkRootProps }

export { LinkIcon, LinkRoot }
