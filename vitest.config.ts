import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

/**
 * Configuración de Vitest.
 * - environment: "jsdom" → simula un navegador en Node para que React pueda renderizar.
 * - setupFiles: corre antes de cada archivo de test (extiende expect con matchers de jest-dom).
 * - alias "@" → mismo que el de Next.js para que los imports relativos funcionen igual.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
