// Fixtures are gitignored — before the parity tests run, refetch them at the
// locked upstream sha whenever they're missing or stale. The pin in
// upstream.lock.json keeps this deterministic; only the download needs the
// network.
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))

export default function setup(): void {
  const lock = JSON.parse(
    readFileSync(path.join(here, "upstream.lock.json"), "utf8")
  ) as { sha: string }
  const stampPath = path.join(here, "fixtures", ".sha")
  const stamp = existsSync(stampPath)
    ? readFileSync(stampPath, "utf8").trim()
    : null
  if (stamp === lock.sha) return
  console.log("parity fixtures missing or stale — syncing from upstream…")
  execFileSync("bun", [path.join(here, "sync.ts")], { stdio: "inherit" })
}
