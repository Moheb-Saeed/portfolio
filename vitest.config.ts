import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit tests only (pure logic). Playwright owns the browser e2e specs under
// `e2e/`, which are excluded here so the two runners never pick up each other's
// files.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
