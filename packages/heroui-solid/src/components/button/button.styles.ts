import clsx from "clsx"

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-soft"

export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonVariantProps {
  /** Visual style of the button. @default "primary" */
  variant?: ButtonVariant
  /** Size of the button. @default "md" */
  size?: ButtonSize
  /** Stretches the button to fill its container. @default false */
  fullWidth?: boolean
  /** Squares the padding for buttons that only contain an icon. @default false */
  isIconOnly?: boolean
}

/**
 * HeroUI `button` BEM classes. Kept in class-set parity with
 * `buttonVariants` from @heroui/styles (verified by button.test.tsx).
 */
export function buttonStyles(props: ButtonVariantProps = {}): string {
  return clsx(
    "button",
    `button--${props.variant ?? "primary"}`,
    `button--${props.size ?? "md"}`,
    props.fullWidth && "button--full-width",
    props.isIconOnly && "button--icon-only"
  )
}
