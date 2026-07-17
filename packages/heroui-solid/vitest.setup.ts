import { cleanup } from "@solidjs/testing-library"
import { afterEach } from "vitest"

// With globals: false, @solidjs/testing-library never registers its own
// afterEach(cleanup) — do it here so renders don't leak across tests.
afterEach(cleanup)
