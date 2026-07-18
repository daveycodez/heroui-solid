import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
      fileName: () => "index.js"
    },
    target: "esnext",
    minify: false,
    emptyOutDir: false,
    rollupOptions: {
      external: [/^solid-js/, /^@kobalte\//, /^@heroui\//]
    }
  }
})
