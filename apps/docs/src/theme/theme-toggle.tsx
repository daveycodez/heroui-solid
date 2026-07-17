import { getThemeVariant, setTheme } from "@kobalte/solidbase/client"
import { Display, Moon, Sun } from "gravity-icons-solid"
import { createSignal, onMount } from "solid-js"

// Solid port of the official HeroUI docs theme switcher (heroui-inc/heroui#v3
// apps/docs src/components/fumadocs/ui/theme-toggle.tsx, the docs'
// "light-dark-system" mode), with gravity icons standing in for lucide
// (Display for Airplay). Active state is gated on mount — the server can't
// know the stored theme, so SSR renders no highlight and it appears after
// hydration, same as the official useIsMounted gate.
const OPTIONS = [
  ["light", Sun],
  ["dark", Moon],
  ["system", Display]
] as const

export default function ThemeToggle() {
  const [mounted, setMounted] = createSignal(false)
  onMount(() => setMounted(true))
  const value = () => (mounted() ? getThemeVariant() : null)

  return (
    <div class="theme-toggle" data-theme-toggle="">
      {OPTIONS.map(([key, Icon]) => (
        <button
          type="button"
          aria-label={key}
          data-active={value() === key ? "" : undefined}
          onClick={() => setTheme(key)}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
