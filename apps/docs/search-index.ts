import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import GithubSlugger from "github-slugger"

// Build-time search index over the MDX routes, exposed to the app as
// `virtual:docs-search-index` (plugin in vite.config.ts) and served by
// src/routes/api/search.ts. Runs in node (vite config context) — the MDX
// pipeline owns `.mdx` imports even with `?raw`, so the sources are read
// straight from disk instead.

export type SearchRecord = {
  id: string
  kind: "page" | "heading"
  title: string
  page: string
  content: string
  url: string
}

const cleanInline = (text: string) =>
  text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim()

function pageRecords(url: string, raw: string): SearchRecord[] {
  let body = raw
  let title = ""
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(raw)
  if (frontmatter) {
    if (/^layout:\s*home/m.test(frontmatter[1])) {
      return []
    }
    title = /^title:\s*(.+)$/m.exec(frontmatter[1])?.[1]?.trim() ?? ""
    body = raw.slice(frontmatter[0].length)
  }
  body = body.replace(/```[\s\S]*?```/g, "").replace(/<[^>]+>/g, "")

  // Sections keyed by heading; h1 text and any pre-heading prose fold into
  // the page-level section ("" key). Anchors come from a stateful
  // GithubSlugger fed every heading in document order, mirroring rehype-slug
  // (duplicate headings get -1 suffixes; h4-h6 advance the counter but stay
  // in section content).
  const sections = new Map<string, string[]>([["", []]])
  const slugs = new Map<string, string>()
  const slugger = new GithubSlugger()
  let current = ""
  for (const line of body.split("\n")) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line)
    if (match) {
      const text = cleanInline(match[2])
      const slug = slugger.slug(text)
      if (match[1].length <= 3) {
        current = match[1].length === 1 ? "" : text
        if (!sections.has(current)) {
          sections.set(current, [])
          slugs.set(current, slug)
        }
      } else if (text) {
        // h4-h6 stay in the current section's content — index the heading
        // text, not the raw `####` markers.
        sections.get(current)?.push(text)
      }
      continue
    }
    if (line.trim()) {
      sections.get(current)?.push(line)
    }
  }

  const records: SearchRecord[] = [
    {
      id: url,
      kind: "page",
      title,
      page: title,
      content: cleanInline(sections.get("")?.join(" ") ?? ""),
      url
    }
  ]
  for (const [heading, text] of sections) {
    if (!heading) {
      continue
    }
    records.push({
      id: `${url}#${slugs.get(heading)}`,
      kind: "heading",
      title: heading,
      page: title,
      content: cleanInline(text.join(" ")),
      url: `${url}#${slugs.get(heading)}`
    })
  }
  return records
}

export function buildSearchIndex(routesDir: string): SearchRecord[] {
  const records: SearchRecord[] = []
  const walk = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name.endsWith(".mdx")) {
        const url =
          `/${path.relative(routesDir, full).replace(/\\/g, "/")}`.replace(
            /(\/index)?\.mdx$/,
            ""
          ) || "/"
        records.push(...pageRecords(url, readFileSync(full, "utf8")))
      }
    }
  }
  walk(routesDir)
  return records
}
