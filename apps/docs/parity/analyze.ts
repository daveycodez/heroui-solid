// Deterministic parity analysis — no diffs, no baselines, no acceptance.
// A demo is compared to its upstream fixture on three facets that survive the
// mechanical React→Solid adaptation untouched: the UI-framework imports, the
// set of components used in JSX, and the text content. A page is compared on
// its structure: title, description, section headings, and previews.
import { existsSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const here = path.dirname(fileURLToPath(import.meta.url))
const docsSrc = path.resolve(here, "../src")
const fixturesRoot = path.join(here, "fixtures")

export const fixtureDir = (slug: string): string =>
  path.join(fixturesRoot, slug)
export const localDemosDir = (demosDir: string): string =>
  path.join(docsSrc, "demos", demosDir)
export const localPagePath = (slug: string): string =>
  path.join(docsSrc, "routes/docs/components", `${slug}.mdx`)

export function demoStems(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort()
}

/* -------------------------------------------------------------------------------------------------
 * Demo analysis
 * -----------------------------------------------------------------------------------------------*/
// Upstream package → canonical name; the local port's packages map onto the
// upstream ones so the import sets compare 1:1.
const UI_PACKAGES: Record<string, string> = {
  "@heroui/react": "@heroui/react",
  "heroui-solid": "@heroui/react",
  "@gravity-ui/icons": "@gravity-ui/icons",
  "gravity-icons-solid": "@gravity-ui/icons"
}

export interface DemoShape {
  uiImports: Set<string>
  components: Set<string>
  text: Set<string>
}

export function analyzeDemo(source: string): DemoShape {
  const sf = ts.createSourceFile(
    "demo.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const uiImports = new Set<string>()
  const components = new Set<string>()
  const text = new Set<string>()
  // Control-flow helpers (<For>, <Show>, React.Fragment…) are framework
  // mechanics, not UI components — tracked by import origin and excluded.
  const frameworkIdents = new Set<string>()

  const addText = (raw: string): void => {
    const t = raw.replace(/\s+/g, " ").trim()
    if (t) text.add(t)
  }

  // Hoisted style objects (`const iconStyle = {…}` used as `style={iconStyle}`)
  // are styling like the attribute itself — collect their names first.
  const styleIdents = new Set<string>()
  const collectStyleIdents = (node: ts.Node): void => {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText() === "style" &&
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression &&
      ts.isIdentifier(node.initializer.expression)
    ) {
      styleIdents.add(node.initializer.expression.text)
    }
    ts.forEachChild(node, collectStyleIdents)
  }
  collectStyleIdents(sf)

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      const spec = (node.moduleSpecifier as ts.StringLiteral).text
      const pkg = UI_PACKAGES[spec]
      const clause = node.importClause
      const isFramework = spec === "solid-js" || spec === "react"
      if (
        (pkg || isFramework) &&
        clause &&
        !clause.isTypeOnly &&
        clause.namedBindings &&
        ts.isNamedImports(clause.namedBindings)
      ) {
        for (const el of clause.namedBindings.elements) {
          if (el.isTypeOnly) continue
          if (pkg)
            uiImports.add(`${pkg} → ${(el.propertyName ?? el.name).text}`)
          else frameworkIdents.add(el.name.text)
        }
      }
      return // module specifiers and binding names are not content
    }
    // "use client" and friends — directives, not content.
    if (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression)) {
      return
    }
    // Strings in type positions (`Omit<Props, "className">`, literal unions)
    // are API-shape adaptation, not content.
    if (ts.isLiteralTypeNode(node)) {
      return
    }
    // splitProps key arrays are the standard Solid replacement for React's
    // destructuring — their prop-name strings are mechanics, not content.
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "splitProps"
    ) {
      return
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      styleIdents.has(node.name.text)
    ) {
      return
    }
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText()
      if (name === "style") return
      if (name === "class" || name === "className") {
        // Literal class strings are the Tailwind↔style adaptation surface;
        // expressions (`class={buttonVariants({ variant: "secondary" })}`)
        // carry semantic values and are walked.
        const init = node.initializer
        const isPlainString =
          init &&
          (ts.isStringLiteral(init) ||
            (ts.isJsxExpression(init) &&
              init.expression !== undefined &&
              ts.isStringLiteral(init.expression)))
        if (isPlainString) return
      }
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText()
      if (/^[A-Z]/.test(tag)) components.add(tag)
    }
    if (ts.isJsxText(node)) {
      addText(node.text)
    } else if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node)
    ) {
      addText(node.text)
    } else if (ts.isTemplateExpression(node)) {
      addText(node.head.text)
      for (const span of node.templateSpans) addText(span.literal.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  for (const ident of frameworkIdents) components.delete(ident)
  return { uiImports, components, text }
}

export function diffSets(
  upstream: Set<string>,
  local: Set<string>
): { missing: string[]; extra: string[] } {
  return {
    missing: [...upstream].filter((x) => !local.has(x)).sort(),
    extra: [...local].filter((x) => !upstream.has(x)).sort()
  }
}

/* -------------------------------------------------------------------------------------------------
 * Page analysis
 * -----------------------------------------------------------------------------------------------*/
export interface PageShape {
  title: string
  description: string
  headings: string[]
  previews: string[]
}

function splitFrontmatter(source: string): {
  frontmatter: Record<string, string>
  body: string
} {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { frontmatter: {}, body: source }
  const frontmatter: Record<string, string> = {}
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/)
    if (kv?.[2]) frontmatter[kv[1]] = kv[2]
  }
  return { frontmatter, body: source.slice(match[0].length) }
}

// Upstream keeps title/description in frontmatter; local pages carry them as
// a leading `# Title` heading + first paragraph.
export function analyzePage(
  source: string,
  side: "upstream" | "local"
): PageShape {
  const { frontmatter, body: rawBody } = splitFrontmatter(
    source.replace(/\r\n/g, "\n")
  )
  let body = rawBody
  let description = frontmatter.description ?? ""

  if (side === "local") {
    const heading = body.match(/^\s*#\s+[^\n]+\n+([^#\n][^\n]*)\n/)
    if (heading) {
      description = heading[1]
      body = body.slice(heading[0].length)
    }
  }

  const headings: string[] = []
  let inFence = false
  for (const line of body.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = line.match(/^#{2,}\s+(.+?)\s*$/)
    if (m) headings.push(m[1])
  }

  const previews = [
    ...body
      .replace(/\s+/g, " ")
      .matchAll(/<ComponentPreview[^>]*name="([^"]+)"/g)
  ].map((m) => m[1])

  return {
    title: (frontmatter.title ?? "").trim(),
    description: description.trim().replace(/\.$/, ""),
    headings,
    previews
  }
}

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/* -------------------------------------------------------------------------------------------------
 * Strict manifest
 * -----------------------------------------------------------------------------------------------*/
// Upstream demos with no local counterpart cannot pass by any means other
// than porting them — the only excuse is a reasoned skip in components.ts,
// and stale skips fail too so the list can't rot.
export function computeGaps(
  slug: string,
  demosDir: string,
  skips: Array<{ stem: string; reason: string }>
): { missingDemos: string[]; staleSkips: string[] } {
  const upstreamStems = demoStems(path.join(fixtureDir(slug), "demos"))
  const localStems = demoStems(localDemosDir(demosDir))
  const skipStems = new Set(skips.map((s) => s.stem))
  return {
    missingDemos: upstreamStems.filter(
      (s) => !localStems.includes(s) && !skipStems.has(s)
    ),
    staleSkips: skips
      .filter(
        (s) => localStems.includes(s.stem) || !upstreamStems.includes(s.stem)
      )
      .map((s) => s.stem)
  }
}
