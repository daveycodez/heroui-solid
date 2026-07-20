import { Button, buttonVariants } from "heroui-solid"
import { splitProps } from "solid-js"
import type { VariantProps } from "tailwind-variants"
import { tv } from "tailwind-variants"

const myButtonVariants = tv({
  base: "text-md font-semibold shadow-md text-shadow-lg data-[pending=true]:opacity-40",
  defaultVariants: {
    radius: "full",
    variant: "primary"
  },
  extend: buttonVariants,
  variants: {
    radius: {
      full: "rounded-full",
      lg: "rounded-lg",
      md: "rounded-md",
      sm: "rounded-sm"
    },
    size: {
      lg: "h-12 px-8",
      md: "h-11 px-6",
      sm: "h-10 px-4",
      xl: "h-13 px-10"
    },
    variant: {
      primary:
        "text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
    }
  }
})

type MyButtonVariants = VariantProps<typeof myButtonVariants>
export type MyButtonProps = Omit<Button["Props"], "class"> &
  MyButtonVariants & { class?: string }

function CustomButton(props: MyButtonProps) {
  const [local, rest] = splitProps(props, ["class", "radius", "variant"])
  return (
    <Button
      class={myButtonVariants({
        class: local.class,
        radius: local.radius,
        variant: local.variant
      })}
      {...rest}
    />
  )
}

export function CustomVariants() {
  return <CustomButton>Custom Button</CustomButton>
}
