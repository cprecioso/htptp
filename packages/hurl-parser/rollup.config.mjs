// @ts-check

import wasm from "@cprecioso/rollup-plugin-wasm"
import nodeResolve from "@rollup/plugin-node-resolve"
import { defineConfig } from "rollup"
import ts from "rollup-plugin-ts"
import typescript from "typescript"
import { execa } from "execa"

export default async () => {
  await execa("wasm-pack", ["build", "rust"], {
    stdout: "inherit",
    stderr: "inherit",
  })

  return defineConfig({
    input: "./js/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].mjs",
      assetFileNames: "assets/[name].[ext]",
    },
    plugins: [
      nodeResolve({ modulesOnly: true }),
      wasm(),
      ts({ typescript, tsconfig: { declaration: true } }),
    ],
  })
}
