import clsx from "clsx"

export type SpinnerColor =
  | "accent"
  | "current"
  | "danger"
  | "success"
  | "warning"

export type SpinnerSize = "sm" | "md" | "lg" | "xl"

export interface SpinnerVariantProps {
  /** Color of the spinner. @default "accent" */
  color?: SpinnerColor
  /** Size of the spinner. @default "md" */
  size?: SpinnerSize
}

/**
 * HeroUI `spinner` BEM classes. Kept in class-set parity with
 * `spinnerVariants` from @heroui/styles (verified by spinner.test.tsx).
 */
export function spinnerStyles(props: SpinnerVariantProps = {}): string {
  return clsx(
    "spinner",
    `spinner--${props.color ?? "accent"}`,
    `spinner--${props.size ?? "md"}`
  )
}
