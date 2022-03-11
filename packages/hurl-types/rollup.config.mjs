// @ts-check

import { defineConfig } from "rollup"
import ts from "rollup-plugin-ts"
import typescript from "typescript"

export default defineConfig({
  input: "./src/index.ts",
  output: { dir: "dist", format: "esm", entryFileNames: "[name].mjs" },
  plugins: [ts({ typescript, tsconfig: { declaration: true } })],
})
