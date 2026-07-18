import { createMemo } from "solid-js"

export interface Filter {
  // Whether `string` contains `substring`, locale-aware.
  contains(string: string, substring: string): boolean
  // Whether `string` starts with `substring`, locale-aware.
  startsWith(string: string, substring: string): boolean
  // Whether `string` ends with `substring`, locale-aware.
  endsWith(string: string, substring: string): boolean
}

// Locale-aware string matching for filtering, ported from React Aria's
// `useFilter`. Backed by `Intl.Collator(usage: "search")`, so with the default
// `sensitivity: "base"` it matches across case and accents (e.g. "resume"
// matches "résumé"). Returned predicates are stable; only the collator depends
// on `options`.
export function useFilter(options?: Intl.CollatorOptions): Filter {
  const collator = createMemo(
    () => new Intl.Collator("en-US", { usage: "search", ...options })
  )

  return {
    startsWith(string, substring) {
      if (substring.length === 0) {
        return true
      }
      const normalized = string.normalize("NFC")
      const sub = substring.normalize("NFC")
      return collator().compare(normalized.slice(0, sub.length), sub) === 0
    },
    endsWith(string, substring) {
      if (substring.length === 0) {
        return true
      }
      const normalized = string.normalize("NFC")
      const sub = substring.normalize("NFC")
      return collator().compare(normalized.slice(-sub.length), sub) === 0
    },
    contains(string, substring) {
      if (substring.length === 0) {
        return true
      }
      const normalized = string.normalize("NFC")
      const sub = substring.normalize("NFC")
      const sliceLen = sub.length
      for (let scan = 0; scan + sliceLen <= normalized.length; scan++) {
        const slice = normalized.slice(scan, scan + sliceLen)
        if (collator().compare(sub, slice) === 0) {
          return true
        }
      }
      return false
    }
  }
}
