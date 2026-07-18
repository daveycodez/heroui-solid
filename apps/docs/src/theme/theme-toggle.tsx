import { Display, Moon, Sun } from "gravity-icons-solid"
import { createSignal, For, onCleanup, onMount } from "solid-js"
import { initThemeManager, preference, setPreference } from "./theme"

// Solid port of the official HeroUI docs theme switcher (heroui-inc/heroui#v3
// apps/docs src/components/fumadocs/ui/theme-toggle.tsx, the docs'
// "light-dark-system" mode), with gravity icons standing in for lucide
// (Display for Airplay). Drives our own HeroUI-native theme manager (theme.ts)
// — exact data-theme="dark"/"light", localStorage preference, no cookies.
// Active state is gated on mount — the server can't know the stored preference,
// so SSR renders no highlight and it appears after hydration, same as the
// official useIsMounted gate.
const OPTIONS = [
  ["light", Sun],
  ["dark", Moon],
  ["system", Display]
] as const

export default function ThemeToggle() {
  const [mounted, setMounted] = createSignal(false)
  onMount(() => {
    onCleanup(initThemeManager())
    setMounted(true)
  })
  const value = () => (mounted() ? preference() : null)

  return (
    <div class="theme-toggle" data-theme-toggle="">
      <For each={OPTIONS}>
        {([key, Icon]) => (
          <button
            type="button"
            aria-label={key}
            aria-pressed={value() === key}
            data-active={value() === key ? "" : undefined}
            onClick={() => setPreference(key)}
          >
            <Icon />
          </button>
        )}
      </For>
    </div>
  )
}
