import { defineConfig } from "vitest/config"

// Docs-scoped parity tests only — pure text comparison, no DOM, no Solid.
export default defineConfig({
  test: {
    environment: "node",
    include: ["parity/**/*.test.ts"],
    globalSetup: ["./parity/global-setup.ts"]
  }
})
