import solid from "vite-plugin-solid"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [solid()],
  resolve: {
    conditions: ["development", "browser"]
  },
  test: {
    environment: "jsdom",
    globals: false,
    passWithNoTests: true,
    setupFiles: ["./vitest.setup.ts"]
  }
})
