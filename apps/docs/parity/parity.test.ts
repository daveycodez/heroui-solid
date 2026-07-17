// Deterministic parity with upstream — every test is a plain pass/fail
// against the vendored fixtures; there is no acceptance baseline to update.
//
// - Strict manifest: every upstream demo exists locally (or carries a
//   reasoned skip in components.ts).
// - Demos: same UI-framework imports, same components used, same text
//   content as upstream. Structure/styling adaptations are invisible to
//   these checks by construction.
// - Pages: same title, description, section headings, and previews as
//   upstream (sections for skipped/unported demos excused — the latter
//   already fail the manifest).
import { readFileSync } from "node:fs"
import path from "node:path"
import { expect, it } from "vitest"
import {
  analyzeDemo,
  analyzePage,
  computeGaps,
  demoStems,
  diffSets,
  fixtureDir,
  localDemosDir,
  localPagePath,
  slugify
} from "./analyze"
import { components } from "./components"

for (const {
  slug,
  demosDir,
  skipDemos = [],
  skipSections = []
} of components) {
  it(`${slug} has no unported upstream demos`, () => {
    const { missingDemos, staleSkips } = computeGaps(slug, demosDir, skipDemos)
    expect
      .soft(
        missingDemos,
        `${slug}: upstream demos not ported — port them into src/demos/${demosDir}/, or (only if impossible in Solid) add a reasoned skip in parity/components.ts`
      )
      .toEqual([])
    expect
      .soft(
        staleSkips,
        `${slug}: stale skips in parity/components.ts — the demo now exists locally or upstream dropped it; remove the entry`
      )
      .toEqual([])
  })

  it(`${slug} demos match upstream imports, components, and text`, () => {
    const fixtureDemos = path.join(fixtureDir(slug), "demos")
    const localDemos = localDemosDir(demosDir)
    const shared = demoStems(fixtureDemos).filter((s) =>
      demoStems(localDemos).includes(s)
    )
    for (const stem of shared) {
      const up = analyzeDemo(
        readFileSync(path.join(fixtureDemos, `${stem}.tsx`), "utf8")
      )
      const local = analyzeDemo(
        readFileSync(path.join(localDemos, `${stem}.tsx`), "utf8")
      )
      const facets = [
        ["UI imports", up.uiImports, local.uiImports],
        ["components", up.components, local.components],
        ["text content", up.text, local.text]
      ] as const
      for (const [facet, upstreamSet, localSet] of facets) {
        const { missing, extra } = diffSets(upstreamSet, localSet)
        expect
          .soft(
            missing,
            `${demosDir}/${stem}.tsx: ${facet} present upstream but missing locally`
          )
          .toEqual([])
        expect
          .soft(
            extra,
            `${demosDir}/${stem}.tsx: ${facet} present locally but not upstream`
          )
          .toEqual([])
      }
    }
  })

  it(`${slug} page mirrors upstream structure`, () => {
    const up = analyzePage(
      readFileSync(path.join(fixtureDir(slug), "page.mdx"), "utf8"),
      "upstream"
    )
    const local = analyzePage(
      readFileSync(localPagePath(slug), "utf8"),
      "local"
    )

    expect.soft(local.title, `${slug}: page title`).toBe(up.title)
    expect
      .soft(local.description, `${slug}: page description`)
      .toBe(up.description)

    // Sections and previews for excused demos: reasoned skips, plus demos the
    // manifest already reports as unported (no double-failing here).
    const { missingDemos } = computeGaps(slug, demosDir, skipDemos)
    const excused = new Set([...skipDemos.map((s) => s.stem), ...missingDemos])
    const skippedHeadings = new Set(skipSections.map((s) => s.heading))

    const requiredHeadings = up.headings.filter(
      (h) => !excused.has(slugify(h)) && !skippedHeadings.has(h)
    )
    for (const heading of requiredHeadings) {
      expect
        .soft(local.headings, `${slug}: missing upstream section "${heading}"`)
        .toContain(heading)
    }

    // Section skips can't rot: each must still exist upstream and not locally.
    const staleSections = skipSections
      .filter(
        (s) =>
          !up.headings.includes(s.heading) || local.headings.includes(s.heading)
      )
      .map((s) => s.heading)
    expect
      .soft(
        staleSections,
        `${slug}: stale skipSections in parity/components.ts — the section is gone upstream or now exists locally; remove the entry`
      )
      .toEqual([])

    const requiredPreviews = up.previews.filter(
      (p) => ![...excused].some((stem) => p.endsWith(`-${stem}`))
    )
    for (const preview of requiredPreviews) {
      expect
        .soft(local.previews, `${slug}: missing upstream preview "${preview}"`)
        .toContain(preview)
    }
  })
}
