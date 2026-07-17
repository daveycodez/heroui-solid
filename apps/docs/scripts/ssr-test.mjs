#!/usr/bin/env bun
// SSR/hydration gate: boots the docs dev server, then loads the /ssr-test
// kitchen sink (every registered demo) plus every docs page in headless
// Chrome, and fails on any hydration-crash signature: console/page errors,
// an empty #app (Solid wipes the page when hydration throws), or a demo
// section that lost its SSR content after hydration. Run via
// `bun nx run docs:ssr-test`. Requires Google Chrome (or CHROME_PATH).
import { spawn } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright-core"

const PORT = 3199
const BASE = `http://localhost:${PORT}`
const docsDir = fileURLToPath(new URL("..", import.meta.url))
const workspaceRoot = fileURLToPath(new URL("../../..", import.meta.url))

// The dev server serves heroui-solid from source, but still imports the
// package's built stylesheet — make sure dist exists.
if (
  !existsSync(
    `${workspaceRoot}/packages/heroui-solid/dist/styles.css`.replace(
      /\/+/g,
      "/"
    )
  )
) {
  console.log("dist/styles.css missing — building heroui-solid first…")
  const build = Bun.spawnSync(["bunx", "nx", "build", "heroui-solid"], {
    cwd: workspaceRoot,
    stdout: "inherit",
    stderr: "inherit"
  })
  if (build.exitCode !== 0) process.exit(build.exitCode)
}

const componentPages = readdirSync(
  fileURLToPath(new URL("../src/routes/docs/components", import.meta.url))
)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => `/docs/components/${f.replace(/\.mdx$/, "")}`)
const pages = ["/ssr-test", "/", "/docs", ...componentPages]

console.log(`Starting docs dev server on :${PORT}…`)
const server = spawn("bunx", ["vite", "dev", "--port", String(PORT)], {
  cwd: docsDir,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, BROWSER: "none" }
})
const killServer = () => {
  try {
    server.kill("SIGTERM")
  } catch {}
}
process.on("exit", killServer)

// generous: CI cold-compiles the whole app on the first /ssr-test fetch
const deadline = Date.now() + 240_000
let ready = false
while (Date.now() < deadline) {
  try {
    const res = await fetch(`${BASE}/ssr-test`)
    if (res.ok) {
      ready = true
      break
    }
  } catch {}
  await new Promise((r) => setTimeout(r, 1000))
}
if (!ready) {
  console.error("Dev server never became ready")
  killServer()
  process.exit(1)
}

const browser = await chromium
  .launch({ channel: "chrome", headless: true })
  .catch(() =>
    chromium.launch({
      executablePath:
        process.env.CHROME_PATH ??
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true
    })
  )

// Solidbase emits a benign dev-only "Hydration Mismatch" console error from
// its Layout on every page (upstream bug, see AGENTS.md) — ignore only that.
const isKnownNoise = (text) =>
  (text.includes("Hydration Mismatch") && text.includes("Layout")) ||
  text.startsWith("[vite]") ||
  text.includes("Failed to load resource")

const checkPage = async (path) => {
  const errors = []
  const page = await browser.newPage()
  page.on("console", (msg) => {
    if (msg.type() === "error" && !isKnownNoise(msg.text())) {
      errors.push(msg.text().split("\n")[0])
    }
  })
  page.on("pageerror", (err) => {
    const text = String(err).split("\n")[0]
    if (!isKnownNoise(text)) errors.push(`pageerror: ${text}`)
  })

  // SSR pass (also warms vite's on-demand compile before the browser visit)
  const ssrHtml = await (await fetch(BASE + path)).text()
  if (!ssrHtml.includes('id="app"')) errors.push("SSR response has no #app")

  await page
    .goto(BASE + path, { waitUntil: "networkidle", timeout: 60_000 })
    .catch((e) => errors.push(`goto: ${e.message.split("\n")[0]}`))
  await page.waitForTimeout(750)

  const appChildren = await page
    .evaluate(() => document.querySelector("#app")?.childElementCount ?? 0)
    .catch(() => 0)
  if (appChildren === 0) {
    errors.push("empty #app after hydration (hydration crash)")
  }

  if (path === "/ssr-test") {
    const ssrDemos = [...ssrHtml.matchAll(/data-demo="([^"]+)"/g)].map(
      (m) => m[1]
    )
    if (ssrDemos.length === 0) errors.push("no demo sections in SSR HTML")
    const domCounts = await page
      .evaluate(() =>
        Object.fromEntries(
          [...document.querySelectorAll("[data-demo]")].map((el) => [
            el.getAttribute("data-demo"),
            el.childElementCount
          ])
        )
      )
      .catch(() => ({}))
    for (const name of ssrDemos) {
      // heading + demo root: fewer than 2 children means the demo's DOM
      // vanished between server render and hydration.
      if ((domCounts[name] ?? 0) < 2) {
        errors.push(`demo "${name}" lost its content after hydration`)
      }
    }
  }

  await page.close()
  return errors
}

const failures = []
for (const path of pages) {
  let errors = await checkPage(path)
  // dev-server on-demand compiles can 500 transiently on first touch
  if (errors.length > 0) errors = await checkPage(path)
  if (errors.length > 0) {
    failures.push({ path, errors })
    console.log(`✗ ${path}`)
    for (const e of errors) console.log(`    ${e}`)
  } else {
    console.log(`✓ ${path}`)
  }
}

await browser.close()
killServer()

if (failures.length > 0) {
  console.error(
    `\n${failures.length}/${pages.length} pages failed SSR/hydration`
  )
  process.exit(1)
}
console.log(`\nAll ${pages.length} pages passed SSR + hydration`)
