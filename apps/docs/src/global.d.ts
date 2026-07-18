/// <reference types="@solidjs/start/env" />

declare module "virtual:docs-search-index" {
  import type { SearchRecord } from "../search-index"

  const records: SearchRecord[]
  export default records
}
