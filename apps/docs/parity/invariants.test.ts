// Local consistency checks between the MDX pages, the demo registry
// (src/demos/index.ts), and the demo files on disk. These encode the
// conventions in AGENTS.md and need no upstream fixtures.
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { components } from "./components"

const here = path.dirname(fileURLToPath(import.meta.url))
const docsSrc = path.resolve(here, "../src")
const demosRoot = path.join(docsSrc, "demos")
const pagesRoot = path.join(docsSrc, "routes/docs/components")

type RegistryEntry = {
  key: string
  identifier: string
  importedName: string
  importPath: string
}

function parseRegistry(): RegistryEntry[] {
  const source = readFileSync(path.join(demosRoot, "index.ts"), "utf8")
  const imports = new Map<string, { name: string; importPath: string }>()
  for (const m of source.matchAll(
    /^import \{ (\w+)(?: as (\w+))? \} from "\.\/(.+)"$/gm
  )) {
    imports.set(m[2] ?? m[1], { name: m[1], importPath: m[3] })
  }
  const entries: RegistryEntry[] = []
  for (const m of source.matchAll(/^ {2}"([a-z0-9-]+)": (\w+),?$/gm)) {
    const imported = imports.get(m[2])
    expect(
      imported,
      `registry entry "${m[1]}" has no matching import`
    ).toBeDefined()
    if (!imported) continue
    entries.push({
      key: m[1],
      identifier: m[2],
      importedName: imported.name,
      importPath: imported.importPath
    })
  }
  return entries
}

const registry = parseRegistry()
const pages = readdirSync(pagesRoot).filter((f) => f.endsWith(".mdx"))
const previewNames = new Map<string, string[]>()
for (const page of pages) {
  const source = readFileSync(path.join(pagesRoot, page), "utf8")
  previewNames.set(
    page,
    [...source.matchAll(/<ComponentPreview name="([^"]+)" \/>/g)].map(
      (m) => m[1]
    )
  )
}
const allPreviews = new Set([...previewNames.values()].flat())

describe("demo registry", () => {
  it("keys follow <demos-dir>-<file-stem> and point at their demo file", () => {
    for (const entry of registry) {
      const expected = entry.importPath.replace("/", "-")
      expect(entry.key, `key for ./${entry.importPath}`).toBe(expected)
    }
  })

  it("every registered demo file exists and exports the imported name", () => {
    for (const entry of registry) {
      const file = path.join(demosRoot, `${entry.importPath}.tsx`)
      const source = readFileSync(file, "utf8")
      expect(
        source,
        `${entry.importPath}.tsx must export function ${entry.importedName}`
      ).toMatch(new RegExp(`export function ${entry.importedName}\\b`))
    }
  })

  it("every demo file on disk is registered", () => {
    const registered = new Set(registry.map((e) => e.importPath))
    for (const { demosDir } of components) {
      for (const f of readdirSync(path.join(demosRoot, demosDir))) {
        expect(registered, `unregistered demo ${demosDir}/${f}`).toContain(
          `${demosDir}/${f.replace(/\.tsx$/, "")}`
        )
      }
    }
  })
})

describe("MDX pages", () => {
  it("every ComponentPreview name is a registry key", () => {
    const keys = new Set(registry.map((e) => e.key))
    for (const [page, names] of previewNames) {
      for (const name of names) {
        expect(keys, `${page}: <ComponentPreview name="${name}">`).toContain(
          name
        )
      }
    }
  })

  it("every registry key is shown on some page", () => {
    for (const entry of registry) {
      expect(
        allPreviews,
        `registry key "${entry.key}" is never rendered by any MDX page`
      ).toContain(entry.key)
    }
  })

  it("every ComponentPreview shows code: its empty file-include or a teaching snippet", () => {
    // The demo file is the single source of truth: the fence under a preview
    // either imports it (remark-code-import, empty body, title="") or is a
    // partial teaching snippet — never an inlined copy of the demo
    // (see AGENTS.md).
    const byKey = new Map(registry.map((e) => [e.key, e]))
    for (const [page, names] of previewNames) {
      const source = readFileSync(path.join(pagesRoot, page), "utf8")
      for (const name of names) {
        const entry = byKey.get(name)
        if (!entry) continue
        const start = source.indexOf(`<ComponentPreview name="${name}" />`)
        const rest = source.slice(start)
        const sectionEnd = rest.slice(1).search(/\n#{2,}\s|<ComponentPreview /)
        const section = sectionEnd === -1 ? rest : rest.slice(0, sectionEnd + 1)
        const fences = [...section.matchAll(/```tsx([^\n]*)\n([\s\S]*?)```/g)]
        const label = `${page}: preview "${name}"`
        // soft: surface every violating preview in one run
        expect
          .soft(
            fences.length,
            `${label} must be followed by a code block (file-include or teaching snippet)`
          )
          .toBeGreaterThan(0)
        for (const [, meta, body] of fences) {
          if (meta.includes("file=")) {
            expect
              .soft(
                meta.trim(),
                `${label}: include fence must reference its demo with title=""`
              )
              .toBe(`file=../../../demos/${entry.importPath}.tsx title=""`)
            expect
              .soft(
                body.trim(),
                `${label}: include fence body must be empty — the demo file is the single source of truth`
              )
              .toBe("")
          } else {
            expect
              .soft(
                body,
                `${label}: inline fence looks like a full demo — import it with file=../../../demos/${entry.importPath}.tsx instead`
              )
              .not.toMatch(/export function /)
          }
        }
      }
    }
  })
})
