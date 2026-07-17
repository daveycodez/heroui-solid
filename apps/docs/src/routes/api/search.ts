// Static search index, fumadocs-style: this route is prerendered by nitro
// (see vite.config.ts) into .output/public/api/search, so the deployed site
// serves it as a plain JSON file. The client (src/theme/search.tsx) fetches
// it once and runs Orama fully in the browser. The records are baked in at
// build time by the docs-search-index plugin (vite.config.ts, parser in
// search-index.ts).

import records from "virtual:docs-search-index"

export function GET(): Response {
  return Response.json(records)
}
