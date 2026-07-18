#!/usr/bin/env bun
// SSR/hydration gate: serves the *production* docs build (nitro) and loads the
// /ssr-test kitchen sink (every registered demo) plus every docs page in
// headless Chrome, failing on any hydration-crash signature: console/page
// errors, an empty #app (Solid wipes the page when hydration throws), or a demo
// section that lost its SSR content after hydration. Testing the built artifact
// (prerendered HTML + heroui-solid's dist) is realistic *and* fast — static
// serving has no per-request compile, so pages load in ~10ms and parallelize,
// unlike the dev server which renders serially. The nx target depends on
// `build`, so `.output` is present (and nx-cached). Run via
// `bun nx run docs:ssr-test`. Requires Google Chrome (or CHROME_PATH).
import { spawn } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright-core"

const PORT = 3199
const BASE = `http://localhost:${PORT}`
const docsDir = fileURLToPath(new URL("..", import.meta.url))
const serverEntry = fileURLToPath(
  new URL("../.output/server/index.mjs", import.meta.url)
)

if (!existsSync(serverEntry)) {
  console.error(
    `Missing ${serverEntry}\nBuild the docs first: bun nx run docs:build`
  )
  process.exit(1)
}

const componentPages = readdirSync(
  fileURLToPath(new URL("../src/routes/docs/components", import.meta.url))
)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => `/docs/components/${f.replace(/\.mdx$/, "")}`)
// Every page — the production server serves prerendered HTML in ~10ms, so full
// coverage is cheap. `/ssr-test` additionally renders every registered demo.
const pages = ["/ssr-test", "/", "/docs", ...componentPages]

console.log(`Serving production build on :${PORT}…`)
const server = spawn("node", [serverEntry], {
  cwd: docsDir,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" }
})
const killServer = () => {
  try {
    server.kill("SIGTERM")
  } catch {}
}
process.on("exit", killServer)

// The prebuilt server boots in ~2s (no compile); allow generous slack for CI.
const deadline = Date.now() + 60_000
let ready = false
while (Date.now() < deadline) {
  try {
    const res = await fetch(`${BASE}/ssr-test`)
    if (res.ok) {
      ready = true
      break
    }
  } catch {}
  await new Promise((r) => setTimeout(r, 500))
}
if (!ready) {
  console.error("Production server never became ready")
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
  // Abort external requests (avatar CDN images, fonts…): they hang/fail slowly
  // and, under `networkidle`, stalled every page for seconds. Hydration is
  // JS-driven and doesn't depend on them, so dropping them is safe and fast.
  await page.route("**/*", (route) => {
    const url = route.request().url()
    if (url.startsWith(BASE) || url.startsWith("data:")) route.continue()
    else route.abort()
  })
  page.on("console", (msg) => {
    if (msg.type() === "error" && !isKnownNoise(msg.text())) {
      errors.push(msg.text().split("\n")[0])
    }
  })
  page.on("pageerror", (err) => {
    const text = String(err).split("\n")[0]
    if (!isKnownNoise(text)) errors.push(`pageerror: ${text}`)
  })

  // SSR pass: the raw HTML the server sends before hydration.
  const ssrHtml = await (await fetch(BASE + path)).text()
  if (!ssrHtml.includes('id="app"')) errors.push("SSR response has no #app")

  // `load` (not `networkidle`) since external requests are blocked — the
  // client bundle + hydration are localhost-only and settle quickly.
  await page
    .goto(BASE + path, { waitUntil: "load", timeout: 30_000 })
    .catch((e) => errors.push(`goto: ${e.message.split("\n")[0]}`))
  await page.waitForTimeout(500)

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
    // Virtualized listboxes render an (empty) tall scroll box until the
    // virtualizer windows rows into it; a section-level child count can't see
    // that, so assert the rows actually appear (catches a blank virtualizer).
    const virtualizedRowCounts = await page
      .evaluate(() =>
        [...document.querySelectorAll('[data-slot="list-box"]')]
          .filter((lb) => /virtual/i.test(lb.getAttribute("aria-label") ?? ""))
          .map(
            (lb) => lb.querySelectorAll('[data-slot="list-box-item"]').length
          )
      )
      .catch(() => [])
    if (virtualizedRowCounts.length === 0) {
      errors.push("no virtualized listbox found on /ssr-test")
    }
    if (virtualizedRowCounts.some((n) => n === 0)) {
      errors.push("a virtualized listbox rendered no rows (blank virtualizer)")
    }
  }

  await page.close()
  return errors
}

const results = new Map()
const check = async (path) => {
  let errors = await checkPage(path)
  if (errors.length > 0) errors = await checkPage(path) // one retry for flakes
  results.set(path, errors)
}

// Check pages concurrently — each gets its own isolated browser page and the
// prebuilt server serves them in ~10ms, so a worker pool loads them fast.
// Tune with SSR_TEST_CONCURRENCY.
const CONCURRENCY = Math.max(1, Number(process.env.SSR_TEST_CONCURRENCY) || 6)
const queue = [...pages]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (;;) {
      const path = queue.shift()
      if (!path) return
      await check(path)
    }
  })
)

// Report in a stable order (concurrency scrambles completion order).
const failures = []
for (const path of pages) {
  const errors = results.get(path) ?? []
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
