// Vendors the upstream HeroUI docs pages + demos this port mirrors into
// parity/fixtures/ at a commit pinned in upstream.lock.json, so the parity
// tests run offline and deterministically.
//
//   bun apps/docs/parity/sync.ts            refetch fixtures at the locked sha
//   bun apps/docs/parity/sync.ts --update   re-pin to upstream HEAD and refetch
//   bun apps/docs/parity/sync.ts --check    compare locked shas against
//                                           upstream HEAD; markdown report on
//                                           stdout, exit 1 on drift
//
// Set GITHUB_TOKEN to raise the GitHub API rate limit (2 API calls per run).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import {
  components,
  UPSTREAM_DEMOS_ROOT,
  UPSTREAM_MDX_ROOT,
  UPSTREAM_REF,
  UPSTREAM_REPO
} from "./components"

const here = path.dirname(fileURLToPath(import.meta.url))
const lockPath = path.join(here, "upstream.lock.json")
const fixturesRoot = path.join(here, "fixtures")

type Lock = {
  repo: string
  ref: string
  sha: string
  files: Record<string, string>
}

function headers(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
  return {
    accept: "application/vnd.github+json",
    ...(token ? { authorization: `Bearer ${token}` } : {})
  }
}

async function apiJson<T>(resource: string): Promise<T> {
  const url = `https://api.github.com/repos/${UPSTREAM_REPO}/${resource}`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) {
    throw new Error(`GitHub API ${url} → ${res.status}: ${await res.text()}`)
  }
  return (await res.json()) as T
}

async function resolveHead(): Promise<string> {
  const commit = await apiJson<{ sha: string }>(`commits/${UPSTREAM_REF}`)
  return commit.sha
}

// path → blob sha for every file in the repo at `sha`
async function fetchTree(sha: string): Promise<Map<string, string>> {
  const tree = await apiJson<{
    truncated: boolean
    tree: Array<{ path: string; type: string; sha: string }>
  }>(`git/trees/${sha}?recursive=1`)
  if (tree.truncated) {
    throw new Error("upstream tree listing truncated — cannot enumerate files")
  }
  return new Map(
    tree.tree.filter((e) => e.type === "blob").map((e) => [e.path, e.sha])
  )
}

type TrackedComponent = {
  slug: string
  mdxPath: string | undefined
  demoPaths: string[]
}

// The component MDX lives under a (category) dir that can move; match by stem.
function trackComponents(tree: Map<string, string>): TrackedComponent[] {
  const paths = [...tree.keys()]
  return components.map(({ slug, demosDir }) => ({
    slug,
    mdxPath: paths.find(
      (p) => p.startsWith(`${UPSTREAM_MDX_ROOT}/`) && p.endsWith(`/${slug}.mdx`)
    ),
    demoPaths: paths.filter((p) =>
      p.startsWith(`${UPSTREAM_DEMOS_ROOT}/${demosDir}/`)
    )
  }))
}

function trackedFileMap(
  tree: Map<string, string>,
  tracked: TrackedComponent[]
): Record<string, string> {
  const files: Record<string, string> = {}
  for (const t of tracked) {
    for (const p of [...(t.mdxPath ? [t.mdxPath] : []), ...t.demoPaths]) {
      files[p] = tree.get(p) as string
    }
  }
  return Object.fromEntries(
    Object.entries(files).sort(([a], [b]) => a.localeCompare(b))
  )
}

async function download(sha: string, filePath: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${UPSTREAM_REPO}/${sha}/${filePath}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return await res.text()
}

async function readLock(): Promise<Lock> {
  return JSON.parse(await readFile(lockPath, "utf8")) as Lock
}

async function sync(sha: string): Promise<void> {
  const tree = await fetchTree(sha)
  const tracked = trackComponents(tree)
  const missing = tracked.filter((t) => !t.mdxPath)
  if (missing.length > 0) {
    throw new Error(
      `no upstream MDX page found for: ${missing.map((t) => t.slug).join(", ")}`
    )
  }

  await rm(fixturesRoot, { recursive: true, force: true })

  const jobs: Array<{ upstreamPath: string; localPath: string }> = []
  for (const t of tracked) {
    const dir = path.join(fixturesRoot, t.slug)
    jobs.push({
      upstreamPath: t.mdxPath as string,
      localPath: path.join(dir, "page.mdx")
    })
    for (const p of t.demoPaths) {
      jobs.push({
        upstreamPath: p,
        localPath: path.join(dir, "demos", path.basename(p))
      })
    }
  }

  const queue = [...jobs]
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (;;) {
        const job = queue.shift()
        if (!job) return
        const content = await download(sha, job.upstreamPath)
        await mkdir(path.dirname(job.localPath), { recursive: true })
        await writeFile(job.localPath, content)
      }
    })
  )

  const lock: Lock = {
    repo: UPSTREAM_REPO,
    ref: UPSTREAM_REF,
    sha,
    files: trackedFileMap(tree, tracked)
  }
  await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`)
  // Fixtures are gitignored; the stamp lets the test globalSetup detect a
  // missing or stale checkout and resync automatically.
  await writeFile(path.join(fixturesRoot, ".sha"), `${sha}\n`)
  console.log(`synced ${jobs.length} fixtures at ${UPSTREAM_REPO}@${sha}`)
}

function blobUrl(sha: string, filePath: string): string {
  return `https://github.com/${UPSTREAM_REPO}/blob/${sha}/${filePath}`
}

async function check(): Promise<void> {
  const lock = await readLock()
  const headSha = await resolveHead()
  const headline = `Tracked upstream docs for [\`${UPSTREAM_REPO}@${UPSTREAM_REF}\`](https://github.com/${UPSTREAM_REPO}/tree/${UPSTREAM_REF}), locked at \`${lock.sha.slice(0, 12)}\`, upstream head \`${headSha.slice(0, 12)}\`.`

  if (headSha === lock.sha) {
    console.log(`${headline}\n\nLock is at upstream head — no drift.`)
    return
  }

  const headTree = await fetchTree(headSha)
  const headFiles = trackedFileMap(headTree, trackComponents(headTree))

  const changed = Object.keys(headFiles).filter(
    (p) => p in lock.files && lock.files[p] !== headFiles[p]
  )
  const added = Object.keys(headFiles).filter((p) => !(p in lock.files))
  const removed = Object.keys(lock.files).filter((p) => !(p in headFiles))

  if (changed.length + added.length + removed.length === 0) {
    console.log(
      `${headline}\n\nUpstream moved but no tracked file changed — no drift. Run \`bun apps/docs/parity/sync.ts --update\` at your leisure to advance the pin.`
    )
    return
  }

  const section = (title: string, files: string[]): string =>
    files.length === 0
      ? ""
      : `\n### ${title} (${files.length})\n\n${files
          .map((p) => `- [\`${p}\`](${blobUrl(headSha, p)})`)
          .join("\n")}\n`

  console.log(
    [
      headline,
      "",
      "Upstream drift detected in tracked files.",
      section("Changed", changed),
      section("Added", added),
      section("Removed", removed),
      "\nTo catch up:",
      "",
      "1. `bun apps/docs/parity/sync.ts --update`",
      "2. Port the content changes (links above show the new upstream state)",
      "3. `bun nx test docs` — the failing components show exactly what moved (imports, components, text, sections)"
    ].join("\n")
  )
  process.exitCode = 1
}

async function main(): Promise<void> {
  const mode = process.argv[2]
  if (mode === "--check") {
    await check()
  } else if (mode === "--update") {
    await sync(await resolveHead())
  } else if (mode === undefined) {
    await sync((await readLock()).sha)
  } else {
    throw new Error(`unknown mode: ${mode}`)
  }
}

await main()
